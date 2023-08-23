import {
    Body,
    Controller,
    Post,
    Get,
    BadRequestException,
    UnauthorizedException,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from './interfaces';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

const REFRESH_TOKEN = 'refreshtoken';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private configService: ConfigService) {}
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user = await this.authService.register(dto);
        if (!user) {
            throw new BadRequestException(
                `Не получется зарегестрировать пользователя с данными ${JSON.stringify(dto)}`,
            );
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const tokens = await this.authService.login(dto);
        if (!tokens) {
            throw new BadRequestException(`Не получется войти с данными ${JSON.stringify(dto)}`);
        }
        this.setRefreshTokenToCookies(tokens, res);
        return 'hekk';
    }

    @Get('refresh')
    refreshTokens() {}

    private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException();
        }
        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/',
        });
        res.status(HttpStatus.CREATED).json(tokens);
    }
}
