import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../services/auth.service'
import { AttendeeValidateResponseDto } from 'src/attendees/models/attendeeValidateReponse.dto';

@Injectable()
export class LocalAttendeeStrategy extends PassportStrategy(Strategy, 'attendee-local') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email'
        });
    }

    async validate(email: string, password: string): Promise<AttendeeValidateResponseDto> {
        if (!email || !password) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }
        const attendee = await this.authService.validateAttendee(email, password);
        if (!attendee) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        return attendee;
    }
}