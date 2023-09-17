import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, ParseIntPipe, HttpException, HttpStatus, UseGuards, Put } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { EventCreateRequestDto } from '../models/eventCreateRequest.dto';
import { EventUpdateRequestDto } from '../models/eventUpdateRequest.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/currentUser.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) { }

    @Get()
    async getEvents() {
        return await this.eventsService.getEvents();
    }

    @Get(':id')
    async getEvent(@Param('id', ParseIntPipe) id: number) {
        return await this.eventsService.getEvent(id);
    }


    @UseGuards(AuthGuard('organizer-jwt'))
    @Post()
    createEvent(@CurrentUser(ParseIntPipe) organizerId: number, @Body() eventCreateRequestDto: EventCreateRequestDto) {
        if (!eventCreateRequestDto.name || !eventCreateRequestDto.description || !eventCreateRequestDto.date ||
            !eventCreateRequestDto.location || !eventCreateRequestDto.maxAttendents) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }
        if (eventCreateRequestDto.date < new Date()) {
            throw new HttpException('Date provided has already passed', HttpStatus.BAD_REQUEST);
        }
        if (eventCreateRequestDto.maxAttendents <= 0) {
            throw new HttpException('Max attendents must be greater than 0', HttpStatus.BAD_REQUEST);
        }
        return this.eventsService.createEvent(organizerId, eventCreateRequestDto);
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @Patch(':id')
    @HttpCode(204)
    async updateEvent(@Param('id', ParseIntPipe) id: number, @CurrentUser(ParseIntPipe) organizerId: number, @Body() eventUpdateRequestDto: EventUpdateRequestDto) {
        if (!eventUpdateRequestDto.name && !eventUpdateRequestDto.description && !eventUpdateRequestDto.date
            && !eventUpdateRequestDto.location && !eventUpdateRequestDto.maxAttendents) {
            return;
        }
        if (eventUpdateRequestDto.date && eventUpdateRequestDto.date < new Date()) {
            throw new HttpException('Date provided has already passed', HttpStatus.BAD_REQUEST);
        }
        if (eventUpdateRequestDto.maxAttendents <= 0) {
            throw new HttpException('Max attendents must be greater than 0', HttpStatus.BAD_REQUEST);
        }

        const event = await this.eventsService.getEvent(id);
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }

        if (event.organizer.id === organizerId) {
            return await this.eventsService.updateEvent(event, eventUpdateRequestDto);
        }
        else {
            throw new HttpException('You do not have permission to edit this event', HttpStatus.FORBIDDEN);
        }
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @Delete(':id')
    @HttpCode(204)
    async deleteEvent(@Param('id', ParseIntPipe) id: number, @CurrentUser(ParseIntPipe) organizerId: number) {
        const event = await this.eventsService.getEvent(id);
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }
        if (event.organizer.id === organizerId) {
            return await this.eventsService.deleteEvent(event);
        }
        else {
            throw new HttpException('You do not have permission to delete this event', HttpStatus.FORBIDDEN);
        }
    }

    @Get('/attendeeCount/:id')
    async getCurrentAttendeeCountForEvent(@Param('id', ParseIntPipe) id: number) {
        return await this.eventsService.getAttendeeCountForEvent(id);
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @Get('/attendeeEmail/:id')
    async getAttendeeEmailForEvent(@Param('id', ParseIntPipe) id: number) {
        return await this.eventsService.getAttendeeEmailForEvent(id);
    }

    @UseGuards(AuthGuard('attendee-jwt'))
    @Put('/:id/attendee/signUp')
    @HttpCode(204)
    async signUpAttendeeToEvent(@CurrentUser(ParseIntPipe) attendeeId: number, @Param('id', ParseIntPipe) id: number) {
        await this.eventsService.signUpAttendeeToEvent(attendeeId, id);
    }
}
