import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from '../models/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCreateRequestDto } from '../models/eventCreateRequest.dto';
import { EventUpdateRequestDto } from '../models/eventUpdateRequest.dto';
import { Attendee } from 'src/attendees/models/attendee.entity';
import { Organizer } from 'src/organizers/models/organizer.entity';

@Injectable()
export class EventsService {

    constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>, @InjectRepository(Attendee) private readonly attendeeRepository: Repository<Attendee>,
        @InjectRepository(Organizer) private readonly organizerRepository: Repository<Organizer>) { }

    async getEvents(): Promise<Event[]> {
        return await this.eventRepository.find({
            relations: ['organizer'],
            select: {
                organizer: {
                    id: true,
                    name: true
                }
            }
        });
    }

    async getEvent(id: number) {
        return await this.eventRepository.findOne({
            where: {
                id: id
            },
            relations: ['organizer'],
            select: {
                organizer: {
                    id: true,
                    name: true
                }
            }
        });
    }

    async getAttendeeCountForEvent(id: number): Promise<number> {
        const event = await this.eventRepository.findOne({
            where: {
                id: id
            },
            relations: ['attendees'],
            select: {
                attendees: true
            }
        });
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        };
        return event.attendees.length;
    }

    async getAttendeeEmailForEvent(id: number): Promise<string[]> {
        const attendeeEmails: string[] = [];
        const event = await this.eventRepository.findOne({
            where: {
                id: id
            },
            relations: ['attendees'],
            select: {
                attendees: {
                    id: true,
                    email: true
                }
            }
        });
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        };

        if (event.attendees) {
            event.attendees.forEach((attendee) => {
                attendeeEmails.push(attendee.email);
            });
        }

        return attendeeEmails;
    }

    async createEvent(organizerId: number, eventCreateRequestDto: EventCreateRequestDto) {
        const event = this.eventRepository.create(eventCreateRequestDto);

        const organizerToAdd = await this.organizerRepository.findOne({
            where: {
                id: organizerId
            }
        })
        event.organizer = organizerToAdd;
        const { id } = await this.eventRepository.save(event);

        const createdEvent = await this.eventRepository.findOne({
            where: {
                id: id
            },
            relations: ['organizer'],
            select: {
                organizer: {
                    id: true,
                    name: true
                }
            }
        });
        return createdEvent;
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

        const currentEventAttendeeCount = await this.getAttendeeCountForEvent(event.id);
        if (currentEventAttendeeCount >= event.maxAttendents) {
            throw new HttpException('This event is unfortunately sold out', HttpStatus.BAD_REQUEST);
        }
        event.attendees = [attendee];
        await this.eventRepository.save(event);
    }
}
