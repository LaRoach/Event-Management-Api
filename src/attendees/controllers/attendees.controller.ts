import { Body, Controller, Delete, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { AttendeesService } from '../services/attendees.service';
import { AttendeeRegisterRequestDto } from '../models/attendeeRegisterRequest.dto';
import { AttendeeLoginRequestDto } from '../models/attendeeLoginRequest.dto';

@Controller('attendees')
export class AttendeesController {

    constructor(private readonly attendeesService: AttendeesService) { }

    @Post('/register')
    registerAttendee(@Body() attendeeRegisterRequestDto: AttendeeRegisterRequestDto): string {
        return this.attendeesService.registerAttendee();
    }

    @Post('/login')
    loginAttendee(@Body() attendeeLoginRequestDto: AttendeeLoginRequestDto): string {
        return this.attendeesService.loginAttendee();
    }

    @Get(':id')
    getAttendee(): string {
        return this.attendeesService.getAttendee();
    }

    @Patch(':id')
    @HttpCode(204)
    updateAttendee(): string {
        return this.attendeesService.updateAttendee();
    }

    @Delete(':id')
    @HttpCode(204)
    deleteAttendee(): string {
        return this.attendeesService.deleteAttendee();
    }
}
