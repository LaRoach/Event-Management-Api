import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Length } from "class-validator";

export class AttendeeUpdateRequestDto {

    @IsOptional()
    @Length(1, 75)
    @ApiProperty({ required: false })
    firstName: string;

    @IsOptional()
    @Length(1, 75)
    @ApiProperty({ required: false })
    lastName: string;

    @IsOptional()
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    displayPic: Express.Multer.File
}