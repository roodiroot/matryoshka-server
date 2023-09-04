import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { FilesModule } from '@files/files.module';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
  imports: [FilesModule]
})
export class AuthorModule {}
