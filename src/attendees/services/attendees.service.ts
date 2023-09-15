import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from '../models/attendee.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { AttendeeRegisterType } from '../models/attendee.types';
import { AttendeeValidateResponseDto } from '../models/attendeeValidateReponse.dto';
import { AttendeeGetResponseDto } from '../models/attendeeGetResponse.dto';
import { AttendeeUpdateRequestDto } from '../models/attendeeUpdateRequest.dto';

@Injectable()
export class AttendeesService {

    constructor(@InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>, private readonly authService: AuthService) { }

    async registerAttendee(attendeeRegisterType: AttendeeRegisterType) {
        attendeeRegisterType.password = await this.authService.hashPassword(attendeeRegisterType.password);
        const attendeeRegister = this.attendeeRepository.create(attendeeRegisterType);
        return await this.attendeeRepository.save(attendeeRegister);
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
        await this.attendeeRepository.save({ ...attendee, ...attendeeUpdateRequestDto });
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
