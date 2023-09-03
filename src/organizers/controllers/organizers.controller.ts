import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { OrganizersService } from '../services/organizers.service';
import { OrganizerRegisterRequestDto } from '../models/organizerRegisterRequest.dto';
import { OrganizerUpdateRequestDto } from '../models/organizerUpdateRequest.dto';
import { OrganizerValidateResponseDto } from '../models/organizerValidateResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/currentUser.decorator';

@Controller('organizers')
export class OrganizersController {

    constructor(private readonly organizersService: OrganizersService) { }

    @Post('/register')
    async registerOrganizer(@Body() organizerRegisterRequestDto: OrganizerRegisterRequestDto) {
        if (!organizerRegisterRequestDto.email || !organizerRegisterRequestDto.password || !organizerRegisterRequestDto.confirmPassword ||
            !organizerRegisterRequestDto.firstName || !organizerRegisterRequestDto.lastName) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }

        if (organizerRegisterRequestDto.password !== organizerRegisterRequestDto.confirmPassword) {
            throw new HttpException('Password and Confirm Password does not match', HttpStatus.BAD_REQUEST);
        }

        return await this.organizersService.registerOrganizer(organizerRegisterRequestDto);
    }

    @UseGuards(AuthGuard('organizer-local'))
    @Post('/login')
    async loginOrganizer(@CurrentUser() organizerValidateResponseDto: OrganizerValidateResponseDto) {
        return { organizerEmail: organizerValidateResponseDto.email, token: await this.organizersService.loginOrganizer(organizerValidateResponseDto) };
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @Get('/profile')
    async getOrganizerProfile(@CurrentUser(ParseIntPipe) organizerId: number) {
        return await this.organizersService.getOrganizer(organizerId);
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @Patch()
    @HttpCode(204)
    async updateOrganizer(@CurrentUser(ParseIntPipe) organizerId: number, @Body() organizerUpdateRequestDto: OrganizerUpdateRequestDto) {
        if (!organizerUpdateRequestDto.firstName && !organizerUpdateRequestDto.lastName) {
            return;
        }
        await this.organizersService.updateOrganizer(organizerId, organizerUpdateRequestDto);
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @Delete()
    @HttpCode(204)
    async deleteOrganizer(@CurrentUser(ParseIntPipe) organizerId: number) {
        await this.organizersService.deleteOrganizer(organizerId);
    }
}
