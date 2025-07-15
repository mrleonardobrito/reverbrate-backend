import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ListsService } from './lists.service';
import { AddItemRequestDto, CreateListRequestDto, UpdateListRequestDto } from './dto/list-request.dto';
import { ListResponseDto } from './dto/list-response.dto';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from '@prisma/client';

@Controller('lists')
@ApiTags('Lists')
@UseGuards(AuthGuard)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new list' })
  @ApiResponse({ status: 201, description: 'List created successfully', type: ListResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateListRequestDto })
  async createList(@Body() createListDto: CreateListRequestDto, @CurrentUser() user: User) {
    return this.listsService.createList(createListDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a list by id' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the list' })
  @ApiResponse({ status: 200, description: 'List retrieved successfully', type: ListResponseDto })
  @ApiResponse({ status: 404, description: 'List not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getList(@Param('id') id: string, @CurrentUser() user: User) {
    return this.listsService.getList(id, user.id);
  }

  @Patch(':id/items')
  @ApiOperation({ summary: 'Add or remove an item from a list' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the list' })
  @ApiBody({ type: AddItemRequestDto })
  @ApiResponse({ status: 200, description: 'Item added or removed successfully', type: ListResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addItemToList(@Param('id') id: string, @Body() addItemToListDto: AddItemRequestDto, @CurrentUser() user: User) {
    if (addItemToListDto.operation === 'add') {
      return this.listsService.addItemToList(id, addItemToListDto.item_id, user.id);
    } else if (addItemToListDto.operation === 'remove') {
      return this.listsService.removeItemFromList(id, addItemToListDto.item_id, user.id);
    } else {
      throw new HttpException('Invalid operation', HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a list' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the list' })
  @ApiBody({ type: UpdateListRequestDto })
  @ApiResponse({ status: 200, description: 'List updated successfully', type: ListResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateList(@Param('id') id: string, @Body() updateListDto: UpdateListRequestDto, @CurrentUser() user: User) {
    return this.listsService.updateList(id, updateListDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lists' })
  @ApiResponse({ status: 200, description: 'Lists retrieved successfully', type: PaginatedResponse<ListResponseDto> })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLists(@Query() paginatedRequest: PaginatedRequest, @CurrentUser() user: User) {
    return this.listsService.getLists(paginatedRequest, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a list' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the list' })
  @ApiResponse({ status: 200, description: 'List deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteList(@Param('id') id: string, @CurrentUser() user: User) {
    return this.listsService.deleteList(id, user.id);
  }
}
