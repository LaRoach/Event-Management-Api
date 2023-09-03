import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { OrganizersModule } from 'src/organizers/organizers.module';
import { AttendeesModule } from 'src/attendees/attendees.module';
import { EventsModule } from 'src/events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from 'src/organizers/models/organizer.entity';
import { LocalOrganizerStrategy } from './strategies/organizers/local.organizer.strategy';
import { JwtOrganizerStrategy } from './strategies/organizers/jwt.organizer.strategy';
import { LocalAttendeeStrategy } from './strategies/attendees/local.attendee.strategy';
import { JwtAttendeeStrategy } from './strategies/attendees/jwt.attendee.strategy';
import { Attendee } from 'src/attendees/models/attendee.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/jwt/JwtConfigService';

@Module({
  imports: [OrganizersModule, AttendeesModule, PassportModule, JwtModule.registerAsync({
    useClass: JwtConfigService
  }), TypeOrmModule.forFeature([Organizer, Attendee])],
  providers: [AuthService, LocalOrganizerStrategy, JwtOrganizerStrategy, LocalAttendeeStrategy, JwtAttendeeStrategy],
  exports: [AuthService]
})
export class AuthModule { }
