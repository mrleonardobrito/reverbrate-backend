import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Iniciar processo de autenticação com Spotify', description: 'Este endpoint redireciona o usuário para a página de autenticação do Spotify. O redirecionamento só funciona corretamente quando acessado via navegador. Ferramentas como Swagger ou Postman não seguem o redirecionamento automaticamente.' })
    @ApiResponse({
        status: 302,
        description: 'Redireciona para a página de autenticação do Spotify'
    })
    @Get('login')
    login(@Res() res: Response) {
        const url = this.authService.getSpotifyAuthUrl();
        res.status(302).redirect(url);
    }

    @ApiOperation({ summary: 'Callback do Spotify após autenticação' })
    @ApiQuery({
        name: 'code',
        required: true,
        description: 'Código de autorização fornecido pelo Spotify'
    })
    @ApiQuery({
        name: 'error',
        required: false,
        description: 'Mensagem de erro caso a autenticação falhe'
    })
    @ApiResponse({
        status: 302,
        description: 'Redireciona para o frontend com os tokens de acesso'
    })
    @ApiResponse({
        status: 400,
        description: 'Erro na autenticação ou código ausente'
    })
    @Get('callback')
    async callback(@Query('code') code: string, @Query('error') error: string, @Res() res: Response) {
        if (error) throw new BadRequestException(error);
        if (!code) throw new BadRequestException('Missing code');

        const tokens = await this.authService.exchangeCodeForTokens(code);

        res.json(tokens);
    }
}
