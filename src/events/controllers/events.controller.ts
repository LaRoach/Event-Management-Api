import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, ParseIntPipe, HttpException, HttpStatus, Res } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { EventCreateRequestDto } from '../models/eventCreateRequest.dto';
import { EventUpdateRequestDto } from '../models/eventUpdateRequest.dto';
import { Response } from 'express';

@Controller('events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) { }

    @Get()
    getEvents(): string {
        return this.eventsService.getEvents();
    }

    @Get(':id')
    getEvent(@Param('id', ParseIntPipe) id: number): string {
        return this.eventsService.getEvent();
    }

    @Post()
    createEvent(@Body() eventCreateRequestDto: EventCreateRequestDto): string {
        if (!eventCreateRequestDto.name || !eventCreateRequestDto.description || !eventCreateRequestDto.date ||
            !eventCreateRequestDto.location || eventCreateRequestDto.maxAttendents) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }

        if (eventCreateRequestDto.date < new Date()) {
            throw new HttpException('Date provided has already passed', HttpStatus.BAD_REQUEST);
        }
        return this.eventsService.createEvent();
    }

    @Patch(':id')
    @HttpCode(204)
    updateEvent(@Param('id', ParseIntPipe) id: number, @Body() eventUpdateRequestDto: EventUpdateRequestDto, @Res() res: Response) {
        if (!eventUpdateRequestDto.name && !eventUpdateRequestDto.description && !eventUpdateRequestDto.date
            && !eventUpdateRequestDto.location && !eventUpdateRequestDto.maxAttendents) {
            return res.sendStatus(204);
        }

        if (eventUpdateRequestDto.date && eventUpdateRequestDto.date < new Date()) {
            throw new HttpException('Date provided has already passed', HttpStatus.BAD_REQUEST);
        }

        return this.eventsService.updateEvent();
    }

    @Delete(':id')
    @HttpCode(204)
    deleteEvent(@Param('id', ParseIntPipe) id: number): string {
        return this.eventsService.deleteEvent();
    }
}
