import { Controller, Delete, Get, HttpCode, Patch } from '@nestjs/common';
import { EventsService } from '../services/events.service';

@Controller('events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) { }

    @Get()
    getEvents(): string {
        return this.eventsService.getEvents();
    }

    @Get(':id')
    getEvent(): string {
        return this.eventsService.getEvent();
    }

    @Patch(':id')
    @HttpCode(204)
    updateEvent(): string {
        return this.eventsService.updateEvent();
    }

    @Delete(':id')
    @HttpCode(204)
    deleteEvent(): string {
        return this.eventsService.deleteEvent();
    }
}
