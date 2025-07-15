import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SignupRequestDto {
  @ApiProperty({ description: 'Nickname do usuário' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Bio do usuário' })
  @IsString()
  bio: string;
}
