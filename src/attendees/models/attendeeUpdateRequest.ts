import { IsOptional, Length } from "class-validator";

export class AttendeeUpdateRequest {

    @IsOptional()
    @Length(1, 150)
    firstName: string;

    @IsOptional()
    @Length(1, 150)
    lastName: string;

    @IsOptional()
    @Length(1, 400)
    displayPic: string
}