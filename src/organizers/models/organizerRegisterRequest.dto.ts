import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class OrganizerRegisterRequestDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string;

    @IsNotEmpty()
    @Length(1, 150)
    name: string;
}