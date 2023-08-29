import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizersService {

    registerOrganizer(): string {
        return "Successfully registered as an organizer"
    }

    loginOrganizer(): string {
        return "Successfully login as an organizer"
    }

    getOrganizer(): string {
        return "Specific organizer details"
    }

    updateOrganizer(): string {
        return "Update organizer"
    }

    deleteOrganizer(): string {
        return "Delete organizer"
    }
}
