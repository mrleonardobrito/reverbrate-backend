import { CreateListRequestDto, UpdateListRequestDto } from "../dto/list-request.dto";
import { List, ListItem, ListType } from "../entities/list.entity";
import { PaginatedRequest } from "src/common/http/dtos/paginated-request.dto";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";

export interface ListRepository {
    create(list: CreateListRequestDto): Promise<List>;
    findById(id: string): Promise<List | null>;
    findAll(paginatedRequest: PaginatedRequest): Promise<PaginatedResponse<List>>;
    update(listId: string, updateListDto: UpdateListRequestDto): Promise<List>;
    addItem(listId: string, itemId: string): Promise<void>;
    removeItem(listId: string, itemId: string): Promise<void>;
    findItemById(itemType: ListType, itemId: string): Promise<ListItem | null>;
    delete(id: string): Promise<void>;
}