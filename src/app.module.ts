import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ArticleModule } from './content/article/article.module';
import { AuthorModule } from './content/author/author.module';

@Module({
    imports: [UserModule, PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), ArticleModule, AuthorModule],
    providers: [{
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },]
})
export class AppModule {}
