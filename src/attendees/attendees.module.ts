import { Module } from '@nestjs/common';
import { AttendeesController } from './controllers/attendees.controller';
import { AttendeesService } from './services/attendees.service';
import { Attendee } from './models/attendee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { Organizer } from 'src/organizers/models/organizer.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/jwt/JwtConfigService';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee, Organizer]),
  JwtModule.registerAsync({
    useClass: JwtConfigService
  })],
  controllers: [AttendeesController],
  providers: [AttendeesService, AuthService]
})
export class AttendeesModule { }
