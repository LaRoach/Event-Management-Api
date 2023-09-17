import { Body, Controller, Delete, Get, HttpCode, Patch, Post, ParseIntPipe, HttpException, HttpStatus, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { AttendeesService } from '../services/attendees.service';
import { AttendeeRegisterRequestDto } from '../models/attendeeRegisterRequest.dto';
import { AttendeeUpdateRequestDto } from '../models/attendeeUpdateRequest.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/currentUser.decorator';
import { AttendeeValidateResponseDto } from '../models/attendeeValidateReponse.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AttendeeLoginRequestDto } from '../models/attendeeLoginRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Attendees')
@Controller('attendees')
export class AttendeesController {

    constructor(private readonly attendeesService: AttendeesService) { }

    @Post('/register')
    async registerAttendee(@Body() attendeeRegisterRequestDto: AttendeeRegisterRequestDto) {
        if (!attendeeRegisterRequestDto.email || !attendeeRegisterRequestDto.password || !attendeeRegisterRequestDto.confirmPassword ||
            !attendeeRegisterRequestDto.firstName || !attendeeRegisterRequestDto.lastName) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }

        if (attendeeRegisterRequestDto.password !== attendeeRegisterRequestDto.confirmPassword) {
            throw new HttpException('Password and Confirm Password does not match', HttpStatus.BAD_REQUEST);
        }

        return await this.attendeesService.registerAttendee(attendeeRegisterRequestDto);
    }

    @ApiBody({ type: AttendeeLoginRequestDto })
    @UseGuards(AuthGuard('attendee-local'))
    @Post('/login')
    async loginAttendee(@CurrentUser() attendeeValidateResponseDto: AttendeeValidateResponseDto) {
        return { attendeeEmail: attendeeValidateResponseDto.email, token: await this.attendeesService.loginAttendee(attendeeValidateResponseDto) };
    }

    @UseGuards(AuthGuard('attendee-jwt'))
    @Get('/profile')
    async getAttendeeProfile(@CurrentUser(ParseIntPipe) attendeeId: number) {
        return await this.attendeesService.getAttendee(attendeeId);
    }

    @UseGuards(AuthGuard('attendee-jwt'))
    @UseInterceptors(FileInterceptor('displayPic'))
    @ApiConsumes('multipart/form-data')
    @Patch()
    @HttpCode(204)
    async updateAttendee(@CurrentUser(ParseIntPipe) attendeeId: number, @Body() attendeeUpdateRequestDto: AttendeeUpdateRequestDto, @UploadedFile(
        new ParseFilePipe({
            validators: [new FileTypeValidator({ fileType: '.(jpg|jpeg|png|bmp|gif)' }), new MaxFileSizeValidator({ maxSize: 3000000 })],
            fileIsRequired: false,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) displayPic: Express.Multer.File) {
        if (!attendeeUpdateRequestDto.firstName && !attendeeUpdateRequestDto.lastName && !displayPic) {
            return;
        }
        attendeeUpdateRequestDto.displayPic = displayPic;
        await this.attendeesService.updateAttendee(attendeeId, attendeeUpdateRequestDto);
    }

    @UseGuards(AuthGuard('attendee-jwt'))
    @Delete()
    @HttpCode(204)
    async deleteAttendee(@CurrentUser(ParseIntPipe) attendeeId: number) {
        await this.attendeesService.deleteAttendee(attendeeId);
    }
}
