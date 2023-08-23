import { Injectable, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name);
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private prismaService: PrismaService,
    ) {}

    async register(dto: RegisterDto) {
        const user: User = await this.userService.findOne(dto.email).catch((err) => {
            this.logger.error(err);
            return null;
        });
        if (user) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }
        return this.userService.save(dto).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }

    async login(dto: LoginDto): Promise<Tokens> {
        const user: User = await this.userService.findOne(dto.email).catch((err) => {
            this.logger.error(err);
            return null;
        });
        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('Не верный логин или пароль');
        }
        const accessToken =
            'Bearer ' +
            this.jwtService.sign({
                id: user.id,
                email: user.email,
                roles: user.roles,
            });

        const refreshToken = await this.getRefreshToken(user.id);

        return { accessToken, refreshToken };
    }

    private async getRefreshToken(userId: string): Promise<Token> {
        return this.prismaService.token.create({
            data: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
            },
        });
    }
}
