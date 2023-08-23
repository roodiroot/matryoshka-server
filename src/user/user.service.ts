import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    save(user: Partial<User>) {
        const hashPassword = this.hashPassword(user.password);
        return this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashPassword,
                roles: ['USER'],
            },
        });
    }

    findOne(idOrEmail: string) {
        return this.prismaService.user.findFirst({
            where: {
                OR: [{ id: idOrEmail }, { email: idOrEmail }],
            },
        });
    }

    delite(id: string) {
        return this.prismaService.user.delete({ where: { id } });
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
