import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Organizer } from '../models/organizer.entity';
import { OrganizerRegisterType } from '../models/organizer.type';
import { AuthService } from '../../auth/services/auth.service';
import { OrganizerValidateResponseDto } from '../models/organizerValidateResponse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizerGetResponseDto } from '../models/organizerGetResponse.dto';
import { OrganizerUpdateRequestDto } from '../models/organizerUpdateRequest.dto';
@Injectable()
export class OrganizersService {

    constructor(@InjectRepository(Organizer) private readonly organizerRepository: Repository<Organizer>, private readonly authService: AuthService) { }

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

    async updateOrganizer(organizerId: number, organizerUpdateRequestDto: OrganizerUpdateRequestDto) {
        const organizer = await this.organizerRepository.findOne({
            where: { id: organizerId }
        });
        if (!organizer) {
            throw new HttpException('Organizer not found', HttpStatus.NOT_FOUND);
        }
        await this.organizerRepository.save({ ...organizer, ...organizerUpdateRequestDto });
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
}
