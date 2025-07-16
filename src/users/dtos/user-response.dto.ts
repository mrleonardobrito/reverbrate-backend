import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsBoolean, IsOptional } from 'class-validator';

export class UserResponseDto {
    @ApiProperty({
        description: "The user's unique ID.",
        example: 'abc12',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({
        description: "The user's unique nickname (username).",
        example: 'camila',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @ApiProperty({
        description: "The user's full name.",
        example: 'Camila Duarte',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        required: false,
        description: "The URL for the user's avatar image.",
        example: 'https://cdn.example.com/avatars/abc12.jpg',
        type: String,
    })
    @IsOptional()
    @IsUrl()
    avatar_url?: string;

    @ApiProperty({
        description: "Indicates if the user's profile is private.",
        example: false,
        default: false,
        type: Boolean,
    })
    @IsBoolean()
    is_private: boolean;
}