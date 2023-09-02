import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { OrganizersModule } from 'src/organizers/organizers.module';
import { AttendeesModule } from 'src/attendees/attendees.module';
import { EventsModule } from 'src/events/events.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from 'src/organizers/models/organizer.entity';
import { LocalOrganizerStrategy } from './strategies/organizers/local.organizer.strategy';
import { JwtOrganizerStrategy } from './strategies/organizers/jwt.organizer.strategy';

@Module({
  imports: [OrganizersModule, AttendeesModule, EventsModule, PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
          global: true
        };
      },
    }), TypeOrmModule.forFeature([Organizer])],
  providers: [AuthService, LocalOrganizerStrategy, JwtOrganizerStrategy],
  exports: [AuthService]
})
export class AuthModule { }
