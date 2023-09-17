import { AutoMap } from "@automapper/classes";
import { Event } from "src/events/models/event.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Organizer {

    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column()
    email: string;

    @Column()
    password: string;

    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @Column({ nullable: true })
    displayPic: string

    @AutoMap()
    @OneToMany(() => Event, (event) => event.organizer)
    events: Event[]
}