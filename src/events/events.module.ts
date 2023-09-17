import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { Event } from './models/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from 'src/attendees/models/attendee.entity';
import { Organizer } from 'src/organizers/models/organizer.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/jwt/JwtConfigService';

@Module({
  imports: [JwtModule.registerAsync({
    useClass: JwtConfigService
  }), TypeOrmModule.forFeature([Event, Attendee, Organizer])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule { }
