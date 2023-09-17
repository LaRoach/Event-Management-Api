import { Body, Controller, Delete, FileTypeValidator, Get, HttpCode, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrganizersService } from '../services/organizers.service';
import { OrganizerRegisterRequestDto } from '../models/organizerRegisterRequest.dto';
import { OrganizerUpdateRequestDto } from '../models/organizerUpdateRequest.dto';
import { OrganizerValidateResponseDto } from '../models/organizerValidateResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/utils/currentUser.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { OrganizerLoginRequestDto } from '../models/organizerLoginRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Organizers')
@Controller('organizers')
export class OrganizersController {

    constructor(private readonly organizersService: OrganizersService) { }

    @Post('/register')
    async registerOrganizer(@Body() organizerRegisterRequestDto: OrganizerRegisterRequestDto) {
        if (!organizerRegisterRequestDto.email || !organizerRegisterRequestDto.password || !organizerRegisterRequestDto.confirmPassword ||
            !organizerRegisterRequestDto.name) {
            throw new HttpException('Required fields not provided', HttpStatus.BAD_REQUEST);
        }

        if (organizerRegisterRequestDto.password !== organizerRegisterRequestDto.confirmPassword) {
            throw new HttpException('Password and Confirm Password does not match', HttpStatus.BAD_REQUEST);
        }

        return await this.organizersService.registerOrganizer(organizerRegisterRequestDto);
    }

    @ApiBody({ type: OrganizerLoginRequestDto })
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

    @Get('/all')
    async getAllOrganizers() {
        return await this.organizersService.getAllOrganizers();
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @UseInterceptors(FileInterceptor('displayPic'))
    @ApiConsumes('multipart/form-data')
    @Patch()
    @HttpCode(204)
    async updateOrganizer(@CurrentUser(ParseIntPipe) organizerId: number, @Body() organizerUpdateRequestDto: OrganizerUpdateRequestDto, @UploadedFile(
        new ParseFilePipe({
            validators: [new FileTypeValidator({ fileType: '.(jpg|jpeg|png|bmp|gif)' }), new MaxFileSizeValidator({ maxSize: 3000000 })],
            fileIsRequired: false,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) displayPic: Express.Multer.File) {
        if (!organizerUpdateRequestDto.name && !displayPic) {
            return;
        }
        organizerUpdateRequestDto.displayPic = displayPic;
        await this.organizersService.updateOrganizer(organizerId, organizerUpdateRequestDto);
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @Delete()
    @HttpCode(204)
    async deleteOrganizer(@CurrentUser(ParseIntPipe) organizerId: number) {
        await this.organizersService.deleteOrganizer(organizerId);
    }

    @UseGuards(AuthGuard('organizer-jwt'))
    @Get('/checkWeatherForecast/:city')
    async getWeatherForecast(@Param('city') city: string) {
        if (!city) {
            throw new HttpException('City not specified', HttpStatus.BAD_REQUEST);
        }
        return await this.organizersService.checkWeatherForecast(city);
    }
}
