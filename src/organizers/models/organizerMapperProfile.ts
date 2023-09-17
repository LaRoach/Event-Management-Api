/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, Mapper } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { Organizer } from "./organizer.entity";
import { OrganizerFetchResponseDto } from "./organizerFetchResponse.dto";

@Injectable()
export class OrganizerMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(mapper, Organizer, OrganizerFetchResponseDto);
        };
    }
}