import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ArticleModule } from '@article/article.module';
import { AuthorModule } from '@author/author.module';
import { ProjectModule } from '@project/project.module';
import { ReviewModule } from '@review/review.module';
import { AchievedModule } from '@achieved/achieved.module';
import { InfoModule } from '@info/info.module';
import { FilesModule } from './files/files.module';

@Module({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }), 
      UserModule, 
      PrismaModule, 
      AuthModule, 
      ArticleModule, 
      AuthorModule, 
      ProjectModule, 
      ReviewModule,
      AchievedModule,
      InfoModule,
      FilesModule
    ],
    providers: [{
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },]
})
export class AppModule {}
