import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { AuthorModule } from '@author/author.module';

@Module({
  imports: [AuthorModule],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService]
})
export class ReviewModule {}
