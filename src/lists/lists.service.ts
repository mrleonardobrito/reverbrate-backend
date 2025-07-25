import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ListRepository } from './interfaces/list-repository.interface';
import { CreateListRequestDto, UpdateListRequestDto } from './dto/list-request.dto';
import { ListItemResponseDto, ListResponseDto } from './dto/list-response.dto';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { ListItemMapper } from './mappers/list-item.mapper';

@Injectable()
export class ListsService {
  constructor(
    @Inject('ListRepository')
    private readonly listsRepository: ListRepository,
  ) { }

  async createList(createListRequestDto: CreateListRequestDto, userId: string): Promise<ListResponseDto> {
    const list = await this.listsRepository.create(createListRequestDto, userId);
    return new ListResponseDto(list, []);
  }

  async getList(id: string, userId: string): Promise<ListResponseDto> {
    const list = await this.listsRepository.findById(id, userId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    return new ListResponseDto(list, list.items.map(item => ListItemMapper.toResponseDto(list.type, item)));
  }

  async addItemToList(listId: string, itemId: string, userId: string): Promise<ListResponseDto> {
    const list = await this.listsRepository.findById(listId, userId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    const item = await this.listsRepository.findItemById(list.type, itemId);
    if (!item) {
      throw new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }
    await this.listsRepository.addItem(listId, itemId, userId);
    const updatedList = await this.listsRepository.findById(listId, userId);
    if (!updatedList) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    return new ListResponseDto(updatedList, updatedList.items.map(item => ListItemMapper.toResponseDto(list.type, item)));
  }

  async removeItemFromList(listId: string, itemId: string, userId: string): Promise<ListResponseDto> {
    const list = await this.listsRepository.findById(listId, userId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    await this.listsRepository.removeItem(listId, itemId, userId);
    const updatedList = await this.listsRepository.findById(listId, userId);
    if (!updatedList) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    return new ListResponseDto(updatedList, []);
  }

  async updateList(listId: string, updateListDto: UpdateListRequestDto, userId: string): Promise<ListResponseDto> {
    const list = await this.listsRepository.findById(listId, userId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    const updatedList = await this.listsRepository.update(listId, updateListDto, userId);
    if (!updatedList) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    return new ListResponseDto(updatedList, updatedList.items.map(item => ListItemMapper.toResponseDto(list.type, item)));
  }

  async getLists(paginatedRequest: PaginatedRequest, userId: string): Promise<PaginatedResponse<ListResponseDto>> {
    const lists = await this.listsRepository.findAll(paginatedRequest, userId);
    return {
      data: lists.data.map(list => new ListResponseDto(list, [])),
      total: lists.total,
      limit: lists.limit,
      next: lists.next,
      offset: lists.offset,
      previous: lists.previous,
    };
  }

  async deleteList(id: string, userId: string): Promise<{ message: string }> {
    const list = await this.listsRepository.findById(id, userId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    await this.listsRepository.delete(id, userId);
    return {
      message: 'List deleted successfully',
    };
  }

  async likeList(id: string, userId: string): Promise<{ message: string }> {
    const list = await this.listsRepository.findById(id, userId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    if (await this.listsRepository.alreadyLiked(id, userId)) {
      await this.listsRepository.unlike(id, userId);
      return {
        message: 'List unliked successfully',
      };
    } else {
      await this.listsRepository.like(id, userId);
      return {
        message: 'List liked successfully',
      };
    }
  }
}
