import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from '../models/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCreateRequestDto } from '../models/eventCreateRequest.dto';
import { EventUpdateRequestDto } from '../models/eventUpdateRequest.dto';

@Injectable()
export class EventsService {

    constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) { }

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
}
