import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthorModule } from '@author/author.module';

@Module({
  imports: [AuthorModule],
  providers: [ReviewService],
  exports: [ReviewService]
})
export class ReviewModule {}
