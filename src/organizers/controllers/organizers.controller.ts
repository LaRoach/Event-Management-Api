import { Controller, Delete, Get, HttpCode, Patch, Post } from '@nestjs/common';
import { OrganizersService } from '../services/organizers.service';

@Controller('organizers')
export class OrganizersController {

    constructor(private readonly organizersService: OrganizersService) { }

    @Post('/register')
    registerOrganizer(): string {
        return this.organizersService.registerOrganizer();
    }

    @Post('/login')
    loginOrganizer(): string {
        return this.organizersService.loginOrganizer();
    }

    @Get(':id')
    getOrganizer(): string {
        return this.organizersService.getOrganizer();
    }

    @Patch(':id')
    @HttpCode(204)
    updateOrganizer(): string {
        return this.organizersService.updateOrganizer();
    }

    @Delete(':id')
    @HttpCode(204)
    deleteOrganizer(): string {
        return this.organizersService.deleteOrganizer();
    }
}
