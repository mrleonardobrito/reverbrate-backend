import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) { }

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
        description: 'Redireciona para o frontend com os cookies de autenticação setados'
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

        res.cookie('access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: this.configService.get<number>('cookies.accessToken.maxAge'),
            path: '/',
        });
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: this.configService.get<number>('cookies.refreshToken.maxAge'),
            path: '/',
        });

        const frontendUrl = this.configService.get<string>('FRONTEND_REDIRECT_URI') || 'http://localhost:3000/';
        res.redirect(frontendUrl);
    }

    @ApiOperation({
        summary: 'Renovar token de acesso',
        description: 'Renova o token de acesso usando o refresh token. Esta rota é chamada automaticamente pelo guard quando necessário.'
    })
    @ApiQuery({
        name: 'refresh_token',
        required: true,
        description: 'Token de renovação'
    })
    @ApiResponse({
        status: 302,
        description: 'Redireciona para o frontend com os novos cookies de autenticação'
    })
    @Get('refresh')
    async refreshToken(@Query('refresh_token') refreshToken: string, @Res() res: Response) {
        if (!refreshToken) throw new BadRequestException('Missing refresh token');
        const tokens = await this.authService.refreshAccessToken(refreshToken);
        res.cookie('access_token', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: this.configService.get<number>('cookies.accessToken.maxAge'),
            path: '/',
        });
        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: this.configService.get<number>('cookies.refreshToken.maxAge'),
            path: '/',
        });
        const frontendUrl = this.configService.get<string>('FRONTEND_REDIRECT_URI') || 'http://localhost:3000/';
        res.redirect(frontendUrl);
    }
}
