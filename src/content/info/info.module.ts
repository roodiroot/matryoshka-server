import { Module } from '@nestjs/common';
import { InfoService } from './info.service';

@Module({
  providers: [InfoService],
  exports: [InfoService]
})
export class InfoModule {}
