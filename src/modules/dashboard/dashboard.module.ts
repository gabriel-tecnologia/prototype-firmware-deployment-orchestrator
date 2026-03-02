import { Module } from '@nestjs/common';
import { ApiGrafanaModule } from '../api-grafana/api-grafana.module';
import { PipelineModule } from '../pipeline/pipeline.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [ApiGrafanaModule, PipelineModule],
  controllers: [DashboardController],
})
export class DashboardModule {}