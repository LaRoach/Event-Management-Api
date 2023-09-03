import { Event } from "src/events/models/event.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attendee {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    displayPic: string

    @ManyToMany(() => Event)
    @JoinTable({
        name: "attendees_events",
        joinColumn: {
            name: "attendee_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "event_id",
            referencedColumnName: "id"
        }
    })
    events: Event[]
}