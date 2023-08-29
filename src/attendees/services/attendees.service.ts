import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendeesService {

    registerAttendee(): string {
        return "Successfully registered as an attendee"
    }

    loginAttendee(): string {
        return "Successfully login as an attendee"
    }

    getAttendee(): string {
        return "Specific attendee details"
    }

    updateAttendee(): string {
        return "Update attendee"
    }

    deleteAttendee(): string {
        return "Delete attendee"
    }
}
