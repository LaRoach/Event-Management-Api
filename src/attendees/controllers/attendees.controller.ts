import { Body, Controller, Delete, Get, HttpCode, Patch, Post, ParseIntPipe, Param, HttpException, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AttendeesService } from '../services/attendees.service';
import { AttendeeRegisterRequestDto } from '../models/attendeeRegisterRequest.dto';
import { AttendeeUpdateRequestDto } from '../models/attendeeUpdateRequest.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/currentUser.decorator';
import { AttendeeValidateResponseDto } from '../models/attendeeValidateReponse.dto';

@Controller('attendees')
export class AttendeesController {

    constructor(private readonly attendeesService: AttendeesService) { }

    @Post('/register')
    registerAttendee(@Body() attendeeRegisterRequestDto: AttendeeRegisterRequestDto) {
        if (!attendeeRegisterRequestDto.email || !attendeeRegisterRequestDto.password || !attendeeRegisterRequestDto.confirmPassword ||
            !attendeeRegisterRequestDto.firstName || !attendeeRegisterRequestDto.lastName) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }

        if (attendeeRegisterRequestDto.password !== attendeeRegisterRequestDto.confirmPassword) {
            throw new HttpException('Password and Confirm Password does not match', HttpStatus.BAD_REQUEST);
        }

        return this.attendeesService.registerAttendee(attendeeRegisterRequestDto);
    }

    @UseGuards(AuthGuard('attendee-local'))
    @Post('/login')
    async loginAttendee(@CurrentUser() attendeeValidateResponseDto: AttendeeValidateResponseDto) {
        return { organizerEmail: attendeeValidateResponseDto.email, token: await this.attendeesService.loginAttendee(attendeeValidateResponseDto) };
    }

    @UseGuards(AuthGuard('attendee-jwt'))
    @Get('/profile')
    async getAttendeeProfile(@CurrentUser(ParseIntPipe) attendeeId: number) {
        return await this.attendeesService.getAttendee(attendeeId);
    }

    @UseGuards(AuthGuard('attendee-jwt'))
    @Patch(':id')
    @HttpCode(204)
    async updateAttendee(@Param('id', ParseIntPipe) id: number, @CurrentUser(ParseIntPipe) attendeeId: number, @Body() attendeeUpdateRequestDto: AttendeeUpdateRequestDto) {
        if (!attendeeUpdateRequestDto.firstName && !attendeeUpdateRequestDto.lastName) {
            return;
        }
        if (id !== attendeeId) {
            throw new HttpException('You do no have permission to edit this attendee\'s details', HttpStatus.FORBIDDEN);
        }
        await this.attendeesService.updateAttendee(attendeeId, attendeeUpdateRequestDto);
    }

    @UseGuards(AuthGuard('attendee-jwt'))
    @Delete(':id')
    @HttpCode(204)
    async deleteAttendee(@Param('id', ParseIntPipe) id: number, @CurrentUser(ParseIntPipe) attendeeId: number) {
        if (id !== attendeeId) {
            throw new HttpException('You do no have permission to delete this attendee\'s details', HttpStatus.FORBIDDEN);
        }
        await this.attendeesService.deleteAttendee(attendeeId);
    }
}
