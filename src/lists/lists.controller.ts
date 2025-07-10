import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ListsService } from './lists.service';
import { AddItemRequestDto, CreateListRequestDto, UpdateListRequestDto } from './dto/list-request.dto';
import { ListResponseDto } from './dto/list-response.dto';
import { PaginatedRequest } from 'src/common/http/dtos/paginated-request.dto';
import { PaginatedResponse } from 'src/common/http/dtos/paginated-response.dto';

@Controller('lists')
@ApiTags('Lists')
@UseGuards(AuthGuard)
export class ListsController {
    constructor(private readonly listsService: ListsService) { }

    @Post()
    @ApiBody({ type: CreateListRequestDto })
    @ApiResponse({ type: ListResponseDto })
    async createList(@Body() createListDto: CreateListRequestDto) {
        return this.listsService.createList(createListDto);
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the list' })
    @ApiResponse({ type: ListResponseDto })
    async getList(@Param('id') id: string) {
        return this.listsService.getList(id);
    }

    @Patch(':id/items')
    @ApiParam({ name: 'id', type: String, description: 'The id of the list' })
    @ApiBody({ type: AddItemRequestDto })
    @ApiResponse({ type: ListResponseDto })
    async addItemToList(@Param('id') id: string, @Body() addItemToListDto: AddItemRequestDto) {
        if (addItemToListDto.operation === 'add') {
            return this.listsService.addItemToList(id, addItemToListDto.item_id);
        } else if (addItemToListDto.operation === 'remove') {
            return this.listsService.removeItemFromList(id, addItemToListDto.item_id);
        } else {
            throw new HttpException('Invalid operation', HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the list' })
    @ApiBody({ type: UpdateListRequestDto })
    @ApiResponse({ type: ListResponseDto })
    async updateList(@Param('id') id: string, @Body() updateListDto: UpdateListRequestDto) {
        return this.listsService.updateList(id, updateListDto);
    }

    @Get()
    @ApiResponse({ type: PaginatedResponse<ListResponseDto> })
    async getLists(@Query() paginatedRequest: PaginatedRequest) {
        return this.listsService.getLists(paginatedRequest);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the list' })
    @ApiResponse({ type: ListResponseDto })
    async deleteList(@Param('id') id: string) {
        return this.listsService.deleteList(id);
    }
}
