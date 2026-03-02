import { Module } from '@nestjs/common';
import { ApiGrafanaModule } from '../api-grafana/api-grafana.module';
import { WavePlannerModule } from '../wave-planner/wave-planner.module';
import { PipelineRepository } from './pipeline.repository';
import { PipelineService } from './pipeline.service';

@Module({
  imports: [ApiGrafanaModule, WavePlannerModule],
  exports: [PipelineService],
  providers: [PipelineRepository, PipelineService],
})
export class PipelineModule {}
