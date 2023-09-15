import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from '../models/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCreateRequestDto } from '../models/eventCreateRequest.dto';
import { EventUpdateRequestDto } from '../models/eventUpdateRequest.dto';
import { Attendee } from 'src/attendees/models/attendee.entity';

@Injectable()
export class EventsService {

    constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>, @InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>) { }

    async getEvents(): Promise<Event[]> {
        return await this.eventRepository.find();
    }

    async getEvent(id: number): Promise<Event> {
        return await this.eventRepository.findOne({
            where: {
                id: id
            },
            relations: ['organizer', 'organizer.id', 'organizer.email']
        });
    }

    async getEventsByOrganizerName(organizerName: string): Promise<Event[]> {
        return await this.eventRepository.find({
            where: {
                name: organizerName
            },
            relations: ['organizer', 'organizer.id', 'organizer.email']
        });
    }

    async getEventsByLocation(location: string): Promise<Event[]> {
        return await this.eventRepository.find({
            where: {
                location: location
            },
            relations: ['organizer', 'organizer.id', 'organizer.email']
        });
    }

    async getAttendeeCountForEvent(id: number): Promise<number> {
        const event = await this.eventRepository.findOne({
            where: {
                id: id
            }
        });
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        };
        return event.maxAttendents;
    }

    async getAttendeeEmailForEvent(id: number): Promise<string[]> {
        const attendeeEmails: string[] = [];
        const event = await this.eventRepository.findOne({
            where: {
                id: id
            }
        });
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        };

        event.attendees.forEach((attendee) => {
            attendeeEmails.push(attendee.email);
        });

        return attendeeEmails;
    }

    async createEvent(organizerId: number, eventCreateRequestDto: EventCreateRequestDto) {
        const event = this.eventRepository.create(eventCreateRequestDto)
        event.organizer.id = organizerId;
        return await this.eventRepository.save(event);
    }

    async updateEvent(event: Event, eventUpdateRequestDto: EventUpdateRequestDto) {
        await this.eventRepository.save({ ...event, ...eventUpdateRequestDto });
    }

    async deleteEvent(event: Event) {
        await this.eventRepository.remove(event);
    }

    async signUpAttendeeToEvent(attendeeId: number, id: number) {
        const event = await this.eventRepository.findOne({
            where: { id: id }
        });
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }
        const attendee = await this.attendeeRepository.findOne({
            where: { id: attendeeId }
        });
        if (!attendee) {
            throw new HttpException('Attendee not found', HttpStatus.NOT_FOUND);
        }
        event.attendees.push(attendee);
        await this.eventRepository.save(event);
    }
}
