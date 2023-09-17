import { IsOptional } from "class-validator";

export class OrganizerUpdateRequest {

    @IsOptional()
    name?: string;

    @IsOptional()
    displayPic?: string;
}