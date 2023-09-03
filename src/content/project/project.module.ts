import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { InfoModule } from '@info/info.module';
import { AchievedModule } from '@achieved/achieved.module';
import { ReviewModule } from '@review/review.module';
import { FilesModule } from '@files/files.module';


@Module({
  imports: [InfoModule, AchievedModule, ReviewModule, FilesModule],
  providers: [ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule {}
