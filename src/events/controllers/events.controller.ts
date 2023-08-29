import { Body, Controller, Delete, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { EventCreateRequestDto } from '../models/eventCreateRequest.dto';

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

    @Post()
    createEvent(@Body() eventCreateRequestDto: EventCreateRequestDto): string {
        return this.eventsService.createEvent();
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
