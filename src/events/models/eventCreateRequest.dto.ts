import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class EventCreateRequestDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsDate()
    date: Date

    @IsNotEmpty()
    @IsString()
    location: string

    @IsNotEmpty()
    @IsNumber()
    maxAttendents: number
}