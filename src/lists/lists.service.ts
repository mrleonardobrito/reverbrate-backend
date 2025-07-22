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

  async createList(createListRequestDto: CreateListRequestDto, userId: string): Promise<ListResponseDto> {
    const list = await this.listsRepository.create(createListRequestDto, userId);
    return {
      id: list.id,
      name: list.name,
      type: list.type,
      items: [],
      created_at: list.createdAt,
      updated_at: list.updatedAt,
      deleted_at: list.deletedAt,
    };
  }

  async getList(id: string, userId: string): Promise<ListResponseDto> {
    const list = await this.listsRepository.findById(id, userId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    return ListMapper.toResponseDto(list);
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
    return ListMapper.toResponseDto(updatedList);
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
    return ListMapper.toResponseDto(updatedList);
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
    return ListMapper.toResponseDto(updatedList);
  }

  async getLists(paginatedRequest: PaginatedRequest, userId: string): Promise<PaginatedResponse<ListResponseDto>> {
    const lists = await this.listsRepository.findAll(paginatedRequest, userId);
    return {
      data: lists.data.map(list => ListMapper.toResponseDto(list)),
      total: lists.total,
      limit: lists.limit,
      next: lists.next,
      offset: lists.offset,
      previous: lists.previous,
    };
  }

  async deleteList(id: string, userId: string): Promise<void> {
    const list = await this.listsRepository.findById(id, userId);
    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }
    await this.listsRepository.delete(id, userId);
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
