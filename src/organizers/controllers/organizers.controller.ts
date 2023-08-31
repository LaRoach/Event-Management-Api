import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Res } from '@nestjs/common';
import { OrganizersService } from '../services/organizers.service';
import { OrganizerRegisterRequestDto } from '../models/organizerRegisterRequest.dto';
import { OrganizerLoginRequestDto } from '../models/organizerLoginRequest.dto';
import { OrganizerUpdateRequestDto } from '../models/organizerUpdateRequest.dto';
import { Response } from 'express';

@Controller('organizers')
export class OrganizersController {

    constructor(private readonly organizersService: OrganizersService) { }

    @Post('/register')
    registerOrganizer(@Body() organizerRegisterRequestDto: OrganizerRegisterRequestDto): string {
        if (!organizerRegisterRequestDto.email || !organizerRegisterRequestDto.password || !organizerRegisterRequestDto.confirmPassword ||
            !organizerRegisterRequestDto.firstName || organizerRegisterRequestDto.lastName) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }

        if (organizerRegisterRequestDto.password !== organizerRegisterRequestDto.confirmPassword) {
            throw new HttpException('Password and Confirm Password does not match', HttpStatus.BAD_REQUEST);
        }

        return this.organizersService.registerOrganizer();
    }

    @Post('/login')
    loginOrganizer(@Body() organizerLoginRequestDto: OrganizerLoginRequestDto): string {

        if (!organizerLoginRequestDto.email || !organizerLoginRequestDto.password) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }

        return this.organizersService.loginOrganizer();
    }

    @Get(':id')
    getOrganizer(@Param('id', ParseIntPipe) id: number): string {
        return this.organizersService.getOrganizer();
    }

    @Patch(':id')
    @HttpCode(204)
    updateOrganizer(@Param('id', ParseIntPipe) id: number, @Body() organizerUpdateRequestDto: OrganizerUpdateRequestDto, @Res() res: Response) {
        if (!organizerUpdateRequestDto.firstName && !organizerUpdateRequestDto.lastName) {
            return res.sendStatus(204);
        }
        return this.organizersService.updateOrganizer();
    }

    @Delete(':id')
    @HttpCode(204)
    deleteOrganizer(@Param('id', ParseIntPipe) id: number): string {
        return this.organizersService.deleteOrganizer();
    }
}
