import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from '../models/attendee.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { AttendeeRegisterType } from '../models/attendee.types';
import { AttendeeValidateResponseDto } from '../models/attendeeValidateReponse.dto';
import { AttendeeGetResponseDto } from '../models/attendeeGetResponse.dto';
import { AttendeeUpdateRequestDto } from '../models/attendeeUpdateRequest.dto';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { AttendeeUpdateRequest } from '../models/attendeeUpdateRequest';

@Injectable()
export class AttendeesService {
    private readonly s3Client = new S3({
        region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
    });
    constructor(@InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>, private readonly authService: AuthService,
        private readonly configService: ConfigService) { }

    async registerAttendee(attendeeRegisterType: AttendeeRegisterType) {
        const checkAttendee = await this.attendeeRepository.findOne({
            where: {
                email: attendeeRegisterType.email
            }
        })
        if (checkAttendee) {
            throw new HttpException('Email already taken', HttpStatus.BAD_REQUEST);
        }

        attendeeRegisterType.password = await this.authService.hashPassword(attendeeRegisterType.password);
        const attendeeRegister = this.attendeeRepository.create(attendeeRegisterType);
        const attendee = await this.attendeeRepository.save(attendeeRegister);
        delete attendee.password;
        return attendee;
    }

    async loginAttendee(attendeeValidateResponseDto: AttendeeValidateResponseDto): Promise<string> {
        return await this.authService.createJwtTokenforAttendee(attendeeValidateResponseDto);
    }

    async getAttendee(attendeeId: number): Promise<AttendeeGetResponseDto> {
        const attendee = await this.attendeeRepository.findOne({
            where: {
                id: attendeeId
            }
        });
        if (!attendee) {
            throw new HttpException('No attendee profile found', HttpStatus.NOT_FOUND);
        }
        const { password, ...result } = attendee;
        return result;
    }

    async updateAttendee(attendeeId: number, attendeeUpdateRequestDto: AttendeeUpdateRequestDto) {
        const attendee = await this.attendeeRepository.findOne({
            where: { id: attendeeId }
        });
        if (!attendee) {
            throw new HttpException('Attendee not found', HttpStatus.NOT_FOUND);
        }

        const attendeeUpdate = new AttendeeUpdateRequest();

        if (attendeeUpdateRequestDto.firstName) {
            attendeeUpdate.firstName = attendeeUpdateRequestDto.firstName;
        }

        if (attendeeUpdateRequestDto.lastName) {
            attendeeUpdate.lastName = attendeeUpdateRequestDto.lastName;
        }

        //save file to AWS if available
        if (attendeeUpdateRequestDto.displayPic) {
            const s3UploadResult = await this.s3Client.upload({
                Bucket: this.configService.getOrThrow<string>('AWS_S3_ATTENDEE_BUCKET'),
                Key: `${attendee.id}_${attendee.email}_profile.${attendeeUpdateRequestDto.displayPic.originalname.slice(attendeeUpdateRequestDto.displayPic.originalname.lastIndexOf('.') + 1)}`,
                Body: attendeeUpdateRequestDto.displayPic.buffer
            }).promise().catch((error) => {
                throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
            });
            attendeeUpdate.displayPic = s3UploadResult.Location;
        }
        await this.attendeeRepository.save({ ...attendee, ...attendeeUpdate });
    }

    async deleteAttendee(attendeeId: number) {
        const attendee = await this.attendeeRepository.findOne({
            where: { id: attendeeId }
        });
        if (!attendee) {
            throw new HttpException('Attendee not found', HttpStatus.NOT_FOUND);
        }
        await this.attendeeRepository.remove(attendee);
    }
}
