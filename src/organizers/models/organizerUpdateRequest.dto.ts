import { IsEmail, IsOptional, Length } from "class-validator";

export class OrganizerUpdateRequestDto {

    @IsOptional()
    @Length(1, 75)
    firstName: string;

    @IsOptional()
    @Length(1, 75)
    lastName: string;
}