import { Body, Controller, Delete, Get, HttpCode, Patch, Post, ParseIntPipe, Param, HttpException, HttpStatus, Res } from '@nestjs/common';
import { AttendeesService } from '../services/attendees.service';
import { AttendeeRegisterRequestDto } from '../models/attendeeRegisterRequest.dto';
import { AttendeeLoginRequestDto } from '../models/attendeeLoginRequest.dto';
import { AttendeeUpdateRequestDto } from '../models/attendeeUpdateRequest.dto';
import { Response } from 'express';

@Controller('attendees')
export class AttendeesController {

    constructor(private readonly attendeesService: AttendeesService) { }

    @Post('/register')
    registerAttendee(@Body() attendeeRegisterRequestDto: AttendeeRegisterRequestDto): string {
        if (!attendeeRegisterRequestDto.email || !attendeeRegisterRequestDto.password || !attendeeRegisterRequestDto.confirmPassword ||
            !attendeeRegisterRequestDto.firstName || attendeeRegisterRequestDto.lastName) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }

        if (attendeeRegisterRequestDto.password !== attendeeRegisterRequestDto.confirmPassword) {
            throw new HttpException('Password and Confirm Password does not match', HttpStatus.BAD_REQUEST);
        }

        return this.attendeesService.registerAttendee();
    }

    @Post('/login')
    loginAttendee(@Body() attendeeLoginRequestDto: AttendeeLoginRequestDto): string {
        if (!attendeeLoginRequestDto.email || !attendeeLoginRequestDto.password) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }
        return this.attendeesService.loginAttendee();
    }

    @Get(':id')
    getAttendee(@Param('id', ParseIntPipe) id: number): string {
        return this.attendeesService.getAttendee();
    }

    @Patch(':id')
    @HttpCode(204)
    updateAttendee(@Param('id', ParseIntPipe) id: number, attendeeUpdateRequestDto: AttendeeUpdateRequestDto, @Res() res: Response) {
        if (!attendeeUpdateRequestDto.firstName && !attendeeUpdateRequestDto.lastName) {
            return res.sendStatus(204);
        }
        return this.attendeesService.updateAttendee();
    }

    @Delete(':id')
    @HttpCode(204)
    deleteAttendee(@Param('id', ParseIntPipe) id: number): string {
        return this.attendeesService.deleteAttendee();
    }
}
