import { IsOptional, Length } from "class-validator";

export class OrganizerUpdateRequestDto {

    @IsOptional()
    @Length(1, 150)
    name: string;
}