
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAttendeeStrategy extends PassportStrategy(Strategy, 'attendee-jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        if (payload.role && payload.role === 'attendee') {
            return payload.sub;
        }
        else {
            throw new HttpException('Token payload missing or not an attendee role', HttpStatus.FORBIDDEN);
        }

    }
}