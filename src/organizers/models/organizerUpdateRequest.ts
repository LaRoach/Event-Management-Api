import { IsOptional, Length } from "class-validator";

export class OrganizerUpdateRequest {

    @IsOptional()
    @Length(1, 150)
    name: string;

    @IsOptional()
    @Length(1, 400)
    displayPic: string
}