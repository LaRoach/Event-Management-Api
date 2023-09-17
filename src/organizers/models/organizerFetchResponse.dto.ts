import { AutoMap } from "@automapper/classes";

export class OrganizerFetchResponseDto {
    @AutoMap()
    id: number;

    @AutoMap()
    name: string;
}