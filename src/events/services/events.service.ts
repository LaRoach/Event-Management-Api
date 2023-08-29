import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {

    getEvents(): string {
        return "All event details"
    }

    getEvent(): string {
        return "Specific event details"
    }

    updateEvent(): string {
        return "Update event"
    }

    deleteEvent(): string {
        return "Delete event"
    }
}
