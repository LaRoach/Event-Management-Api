import { IsEmail, IsNotEmpty } from "class-validator";

export class AttendeeLoginRequestDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}