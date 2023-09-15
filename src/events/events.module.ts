import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { Event } from './models/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from 'src/attendees/models/attendee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule { }
