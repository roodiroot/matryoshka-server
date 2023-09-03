import { Module } from '@nestjs/common';
import { AchievedController } from './achieved.controller';
import { AchievedService } from './achieved.service';

@Module({
  controllers: [AchievedController],
  providers: [AchievedService],
  exports: [AchievedService]
})
export class AchievedModule {}
