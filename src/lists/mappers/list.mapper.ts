import { List } from "../entities/list.entity";
import { ListResponseDto } from "../dto/list-response.dto";
import { ListItemMapper } from "./list-item.mapper";

export class ListMapper {
    static toResponseDto(list: List): ListResponseDto {
        return {
            id: list.id,
            name: list.name,
            type: list.type,
            items: list.items?.map((item) => ListItemMapper.toResponseDto(list.type, item)) || [],
            created_at: list.createdAt,
            updated_at: list.updatedAt,
            deleted_at: list.deletedAt,
        };
    }
}   