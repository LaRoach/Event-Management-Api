import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class AttendeeUpdateRequestDto {

    @IsOptional()
    @ApiProperty({ required: false })
    firstName?: string;

    @IsOptional()
    @ApiProperty({ required: false })
    lastName?: string;

    @IsOptional()
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    displayPic?: Express.Multer.File;
}