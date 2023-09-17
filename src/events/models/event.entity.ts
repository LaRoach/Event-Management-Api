import { Attendee } from "src/attendees/models/attendee.entity";
import { Organizer } from "src/organizers/models/organizer.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ nullable: true })
    description: string

    @Column()
    date: Date

    @Column()
    location: string

    @Column()
    maxAttendents: number

    @ManyToOne(() => Organizer, (organizer) => organizer.events, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organizerId' })
    organizer: Organizer

    @ManyToMany(() => Attendee)
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
    attendees: Attendee[]
}