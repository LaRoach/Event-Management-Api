import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class OrganizerUpdateRequestDto {

    @IsOptional()
    @ApiProperty({ required: false })
    name?: string;

    @IsOptional()
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    displayPic?: Express.Multer.File;
}