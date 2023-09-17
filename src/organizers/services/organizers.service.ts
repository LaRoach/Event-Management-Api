import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organizer } from '../models/organizer.entity';
import { OrganizerRegisterType } from '../models/organizer.types';
import { AuthService } from '../../auth/services/auth.service';
import { OrganizerValidateResponseDto } from '../models/organizerValidateResponse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizerGetResponseDto } from '../models/organizerGetResponse.dto';
import { OrganizerUpdateRequestDto } from '../models/organizerUpdateRequest.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { OrganizerUpdateRequest } from '../models/organizerUpdateRequest';
import { S3 } from 'aws-sdk';
import { OrganizerFetchResponseDto } from '../models/organizerFetchResponse.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Event } from 'src/events/models/event.entity';

@Injectable()
export class OrganizersService {

    private readonly s3Client = new S3({
        region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
    });

    constructor(@InjectRepository(Organizer) private readonly organizerRepository: Repository<Organizer>, @InjectRepository(Event) private readonly eventRepository: Repository<Event>, private readonly authService: AuthService, private readonly httpService: HttpService,
        private readonly configService: ConfigService, @InjectMapper() private readonly classMapper: Mapper) { }

    async registerOrganizer(organizerRegisterType: OrganizerRegisterType) {
        organizerRegisterType.password = await this.authService.hashPassword(organizerRegisterType.password);
        const organizerRegister = this.organizerRepository.create(organizerRegisterType);
        return await this.organizerRepository.save(organizerRegister);
    }

    async loginOrganizer(organizerValidateResponseDto: OrganizerValidateResponseDto): Promise<string> {
        return await this.authService.createJwtTokenforOrganizer(organizerValidateResponseDto);
    }

    async getOrganizer(organizerId: number): Promise<OrganizerGetResponseDto> {
        const organizer = await this.organizerRepository.findOne({
            where: {
                id: organizerId
            }
        });
        if (!organizer) {
            throw new HttpException('No organizer profile found', HttpStatus.NOT_FOUND);
        }
        const { password, events, ...result } = organizer;
        return result;
    }

    async getAllOrganizers() {
        return this.classMapper.mapArrayAsync(await this.organizerRepository.find(), Organizer, OrganizerFetchResponseDto);
    }

    async updateOrganizer(organizerId: number, organizerUpdateRequestDto: OrganizerUpdateRequestDto) {
        const organizer = await this.organizerRepository.findOne({
            where: { id: organizerId }
        });
        if (!organizer) {
            throw new HttpException('Organizer not found', HttpStatus.NOT_FOUND);
        }

        const organizerUpdate = new OrganizerUpdateRequest();
        if (organizerUpdateRequestDto.name) {
            organizerUpdate.name = organizerUpdateRequestDto.name;
        }

        //save file to AWS if available
        if (organizerUpdateRequestDto.displayPic) {
            const s3UploadResult = await this.s3Client.upload({
                Bucket: this.configService.getOrThrow<string>('AWS_S3_ORGANIZER_BUCKET'),
                Key: `${organizer.id}_${organizer.email}_profile.${organizerUpdateRequestDto.displayPic.originalname.slice(organizerUpdateRequestDto.displayPic.originalname.lastIndexOf('.') + 1)}`,
                Body: organizerUpdateRequestDto.displayPic.buffer
            }).promise().catch((error) => {
                throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
            });
            organizerUpdate.displayPic = s3UploadResult.Location;
        }

        await this.organizerRepository.save({ ...organizer, ...organizerUpdate });
    }

    async deleteOrganizer(organizerId: number) {
        const organizer = await this.organizerRepository.findOne({
            where: { id: organizerId }
        });
        if (!organizer) {
            throw new HttpException('Organizer not found', HttpStatus.NOT_FOUND);
        }

        await this.organizerRepository.remove(organizer);
    }

    async checkWeatherForecast(city: string) {
        const { data } = await firstValueFrom(this.httpService.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.configService.getOrThrow<string>('WEATHER_APIKEY')}`).pipe(
            catchError((error: AxiosError) => {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            })));
        return data;
    }
}
