import { Organizer } from "src/organizers/models/organizer.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

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

    @ManyToOne(() => Organizer, (organizer) => organizer.events, { nullable: false })
    @JoinColumn({ name: 'organizerId' })
    organizer: Organizer
}