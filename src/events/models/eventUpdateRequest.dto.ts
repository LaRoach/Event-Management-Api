import { PartialType } from '@nestjs/mapped-types'
import { EventCreateRequestDto } from './eventCreateRequest.dto'

export class EventUpdateRequestDto extends PartialType(EventCreateRequestDto) {

    name?: string

    description?: string

    date?: Date

    location?: string

    maxAttendents?: number
}