import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { AuthorModule } from '../author/author.module';
import { FilesModule } from '@files/files.module';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [AuthorModule, FilesModule]
})
export class ArticleModule {}
