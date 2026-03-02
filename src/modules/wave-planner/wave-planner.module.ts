import { Module } from '@nestjs/common';
import { WavePlannerRepository } from './wave-planner.repository';
import { WavePlannerService } from './wave-planner.service';

@Module({
  exports: [WavePlannerService],
  providers: [WavePlannerRepository, WavePlannerService],
})
export class WavePlannerModule {}
