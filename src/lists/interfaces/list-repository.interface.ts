import { CreateListRequestDto, UpdateListRequestDto } from "../dto/list-request.dto";
import { List, ListItem, ListType } from "../entities/list.entity";
import { PaginatedRequest } from "src/common/http/dtos/paginated-request.dto";
import { PaginatedResponse } from "src/common/http/dtos/paginated-response.dto";

export interface ListRepository {
    create(list: CreateListRequestDto, userId: string): Promise<List>;
    findById(id: string, userId: string): Promise<List | null>;
    findAll(paginatedRequest: PaginatedRequest, userId: string): Promise<PaginatedResponse<List>>;
    update(listId: string, updateListDto: UpdateListRequestDto, userId: string): Promise<List>;
    addItem(listId: string, itemId: string, userId: string): Promise<void>;
    removeItem(listId: string, itemId: string, userId: string): Promise<void>;
    findItemById(itemType: ListType, itemId: string): Promise<ListItem | null>;
    delete(id: string, userId: string): Promise<void>;
}