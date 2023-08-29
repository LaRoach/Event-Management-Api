import { IsEmail, IsNotEmpty } from 'class-validator';
export class OrganizerLoginRequestDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}