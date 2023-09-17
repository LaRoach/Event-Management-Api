import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinDate, minDate } from 'class-validator';
export class EventCreateRequestDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsNotEmpty()
    @Transform(({ value }) => value && new Date(value))
    @MinDate(new Date)
    date: Date

    @IsNotEmpty()
    @IsString()
    location: string

    @IsNotEmpty()
    @IsNumber()
    maxAttendents: number
}