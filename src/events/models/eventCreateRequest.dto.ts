import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class EventCreateRequestDto {

    @IsNotEmpty()
    name: string

    @IsOptional()
    description: string

    @IsNotEmpty()
    @IsDate()
    date: Date

    @IsNotEmpty()
    location: string

    @IsNotEmpty()
    @IsNumber()
    maxAttendents: number
}