import { PartialType } from "@nestjs/mapped-types"
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator"
import { EventCreateRequestDto } from "./eventCreateRequest.dto"

export class EventUpdateRequestDto extends PartialType(EventCreateRequestDto) {

    name?: string

    description?: string

    date?: Date

    location?: string

    maxAttendents?: number
}