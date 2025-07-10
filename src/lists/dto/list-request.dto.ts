import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ListType } from "../entities/list.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateListRequestDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The name of the list', example: 'My List' })
    name: string;

    @IsEnum(ListType)
    @ApiProperty({ description: 'The type of the list', example: ListType.ARTIST })
    type: ListType;
}

export class UpdateListRequestDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The name of the list', example: 'My List' })
    name: string;
}

export class AddItemRequestDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'The id of the item', example: '123' })
    item_id: string;

    @IsEnum(['add', 'remove'])
    @ApiProperty({ description: 'The operation to be performed', example: 'add' })
    operation: 'add' | 'remove';
}   