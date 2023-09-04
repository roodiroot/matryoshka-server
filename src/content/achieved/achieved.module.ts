import { Module } from '@nestjs/common';
import { AchievedService } from './achieved.service';

@Module({
  providers: [AchievedService],
  exports: [AchievedService]
})
export class AchievedModule {}
