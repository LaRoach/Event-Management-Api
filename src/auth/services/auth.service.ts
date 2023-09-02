import { Injectable } from '@nestjs/common';
import { Organizer } from 'src/organizers/models/organizer.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { OrganizerValidateResponseDto } from 'src/organizers/models/organizerValidateResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(Organizer) private readonly organizerRepository: Repository<Organizer>, private readonly jwtService: JwtService) { }

    async validateOrganizer(email: string, password: string): Promise<OrganizerValidateResponseDto> {
        const organizer = await this.organizerRepository.findOne({
            where: { email: email }
        });

        if (organizer && await bcrypt.compare(password, organizer.password)) {
            const { password, events, displayPic, ...result } = organizer;
            return result;
        }
        return null;
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async createJwtTokenforOrganizer(organizerValidateResponseDto: OrganizerValidateResponseDto): Promise<string> {
        const payload = {
            sub: organizerValidateResponseDto.id, email: organizerValidateResponseDto.email, firstName: organizerValidateResponseDto.firstName,
            lastName: organizerValidateResponseDto.lastName, role: 'organizer'
        };
        return await this.jwtService.signAsync(payload);
    }

    async createJwtTokenforAttendee() {

    }
}
