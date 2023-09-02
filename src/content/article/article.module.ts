import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { AuthorModule } from '../author/author.module';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [AuthorModule]
})
export class ArticleModule {}
