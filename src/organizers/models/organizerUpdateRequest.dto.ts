import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Length } from "class-validator";

export class OrganizerUpdateRequestDto {

    @IsOptional()
    @Length(1, 150)
    @ApiProperty({ required: false })
    name: string;

    @IsOptional()
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    displayPic: Express.Multer.File
}