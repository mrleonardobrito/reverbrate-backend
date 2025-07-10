import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ListRepository } from './interfaces/list-repository.interface';
import { CreateListRequestDto, UpdateListRequestDto } from './dto/list-request.dto';
import { ListResponseDto } from './dto/list-response.dto';
import { ListMapper } from './mappers/list.mapper';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';

@Injectable()
export class ListsService {
    constructor(
        @Inject('ListRepository')
        private readonly listsRepository: ListRepository,
    ) { }

    async createList(createListRequestDto: CreateListRequestDto): Promise<ListResponseDto> {
        const list = await this.listsRepository.create(createListRequestDto);
        return {
            id: list.id,
            name: list.name,
            type: list.type,
            items: [],
            created_at: list.createdAt,
            updated_at: list.updatedAt,
            deleted_at: list.deletedAt,
        }
    }

    async getList(id: string): Promise<ListResponseDto> {
        const list = await this.listsRepository.findById(id);
        if (!list) {
            throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
        return ListMapper.toResponseDto(list);
    }

    async addItemToList(listId: string, itemId: string): Promise<ListResponseDto> {
        const list = await this.listsRepository.findById(listId);
        if (!list) {
            throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
        const item = await this.listsRepository.findItemById(list.type, itemId);
        if (!item) {
            throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
        }
        await this.listsRepository.addItem(listId, itemId);
        const updatedList = await this.listsRepository.findById(listId);
        if (!updatedList) {
            throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
        return ListMapper.toResponseDto(updatedList);
    }

    async removeItemFromList(listId: string, itemId: string): Promise<ListResponseDto> {
        const list = await this.listsRepository.findById(listId);
        if (!list) {
            throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
        await this.listsRepository.removeItem(listId, itemId);
        const updatedList = await this.listsRepository.findById(listId);
        if (!updatedList) {
            throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
        return ListMapper.toResponseDto(updatedList);
    }

    async updateList(listId: string, updateListDto: UpdateListRequestDto): Promise<ListResponseDto> {
        const list = await this.listsRepository.findById(listId);
        if (!list) {
            throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
        const updatedList = await this.listsRepository.update(listId, updateListDto);
        if (!updatedList) {
            throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
        return ListMapper.toResponseDto(updatedList);
    }

    async getLists(paginatedRequest: PaginatedRequest): Promise<PaginatedResponse<ListResponseDto>> {
        const lists = await this.listsRepository.findAll(paginatedRequest);
        return {
            data: lists.data.map(list => ListMapper.toResponseDto(list)),
            total: lists.total,
            limit: lists.limit,
            next: lists.next,
            offset: lists.offset,
            previous: lists.previous,
        };
    }

    async deleteList(id: string): Promise<void> {
        const list = await this.listsRepository.findById(id);
        if (!list) {
            throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
        await this.listsRepository.delete(id);
    }
}
