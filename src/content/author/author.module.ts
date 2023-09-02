import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService]
})
export class AuthorModule {}
