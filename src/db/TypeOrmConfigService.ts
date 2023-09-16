import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Attendee } from "src/attendees/models/attendee.entity";
import { Event } from "src/events/models/event.entity";
import { Organizer } from "src/organizers/models/organizer.entity";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) { }
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.getOrThrow<string>('DB_HOST'),
            port: this.configService.getOrThrow<number>('DB_PORT'),
            username: this.configService.getOrThrow<string>('DB_USERNAME'),
            password: this.configService.getOrThrow<string>('DB_PASSWORD'),
            database: this.configService.getOrThrow<string>('DB_NAME'),
            entities: [Organizer, Event, Attendee],
            synchronize: true
        };
    }
}