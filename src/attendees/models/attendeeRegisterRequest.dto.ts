import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class AttendeeRegisterRequestDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string;

    @IsNotEmpty()
    @Length(1, 75)
    firstName: string;

    @IsNotEmpty()
    @Length(1, 75)
    lastName: string;
}