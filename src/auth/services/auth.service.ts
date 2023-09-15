import { Injectable } from '@nestjs/common';
import { Organizer } from 'src/organizers/models/organizer.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { OrganizerValidateResponseDto } from 'src/organizers/models/organizerValidateResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeeValidateResponseDto } from 'src/attendees/models/attendeeValidateReponse.dto';
import { Attendee } from 'src/attendees/models/attendee.entity';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(Organizer) private readonly organizerRepository: Repository<Organizer>,
        @InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>, private readonly jwtService: JwtService) { }

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

    async validateAttendee(email: string, password: string): Promise<AttendeeValidateResponseDto> {
        const attendee = await this.attendeeRepository.findOne({
            where: { email: email }
        });

        if (attendee && await bcrypt.compare(password, attendee.password)) {
            const { password, displayPic, ...result } = attendee;
            return result;
        }
        return null;
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async createJwtTokenforOrganizer(organizerValidateResponseDto: OrganizerValidateResponseDto): Promise<string> {
        const payload = {
            sub: organizerValidateResponseDto.id, email: organizerValidateResponseDto.email, name: organizerValidateResponseDto.name, role: 'organizer'
        };
        return await this.jwtService.signAsync(payload);
    }

    async createJwtTokenforAttendee(attendeeValidateResponseDto: AttendeeValidateResponseDto): Promise<string> {
        const payload = {
            sub: attendeeValidateResponseDto.id, email: attendeeValidateResponseDto.email, firstName: attendeeValidateResponseDto.firstName,
            lastName: attendeeValidateResponseDto.lastName, role: 'attendee'
        };
        return await this.jwtService.signAsync(payload);
    }
}
