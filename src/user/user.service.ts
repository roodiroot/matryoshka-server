import { JwtPayload } from 'src/auth/interfaces';
import { convertToSecondsUtil } from '@common/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService, 
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private configService: ConfigService
        ) {}

    async save(user: Partial<User>) {
        const hashPassword = user?.password ? this.hashPassword(user.password) : null;
        const savedUser = await this.prismaService.user.upsert({
            where: {email: user.email},
            update: {
                password: hashPassword ?? undefined,
                roles: user?.roles ?? undefined,
                provider: user?.provider ?? undefined,
                isBlocked: user?.isBlocked ?? undefined
            },
            create: {
                email: user.email,
                password: hashPassword,
                roles: ['USER'],
                provider: user?.provider
            },
        });
        this.cacheManager.set(savedUser.id, savedUser)
        this.cacheManager.set(savedUser.email, savedUser)
        return savedUser
    }

    async findOne(idOrEmail: string, isReset = false) {
        if(isReset){
            await this.cacheManager.del(idOrEmail)
        }
        const user = await this.cacheManager.get<User>(idOrEmail)
        if(!user){
            const user = await this.prismaService.user.findFirst({
                where: {
                    OR: [{ id: String(idOrEmail) }, { email: String(idOrEmail) }],
                },
            });
            if(!user){
                return null;
            }
            await this.cacheManager.set(idOrEmail, user, convertToSecondsUtil(this.configService.get('JWT_EXP')))
            return user;
        }
        return user;
    }

    async delite(id: string, user: JwtPayload) {
        const userDelete = await this.findOne(id)
        if(!userDelete){
            throw new UnauthorizedException(`пользователя с id ${id} не существует`)
        }
        if(id !== user.id && !user.roles.includes(Role.ADMIN)){
            throw new ForbiddenException('нет доступа')
        }
        await Promise.all([
            this.cacheManager.del(id),
            this.cacheManager.del(user.email),
        ])
        return this.prismaService.user.delete({ where: { id }, select: {id: true} });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
