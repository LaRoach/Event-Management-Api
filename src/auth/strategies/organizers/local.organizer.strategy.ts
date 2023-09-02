import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../services/auth.service'
import { OrganizerValidateResponseDto } from 'src/organizers/models/organizerValidateResponse.dto';

@Injectable()
export class LocalOrganizerStrategy extends PassportStrategy(Strategy, 'organizer-local') {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email'
        });
    }

    async validate(email: string, password: string): Promise<OrganizerValidateResponseDto> {
        if (!email || !password) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }
        const organizer = await this.authService.validateOrganizer(email, password);
        if (!organizer) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        return organizer;
    }
}