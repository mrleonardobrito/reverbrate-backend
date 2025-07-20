import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({
        description: 'The name of the user.',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The bio of the user.',
        example: 'I am a software engineer and a music lover.',
    })
    @IsString()
    @IsOptional()
    bio?: string;

    @ApiProperty({
        description: 'Whether the user is private.',
        example: false,
    })
    @IsBoolean()
    @IsOptional()
    is_private?: boolean;
}