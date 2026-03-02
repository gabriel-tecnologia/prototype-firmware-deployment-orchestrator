import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiGrafanaService } from './api-grafana.service';
import { ApiGrafanaRepository } from './api-grafana.repository';

@Module({
  imports: [HttpModule],
  exports: [ApiGrafanaService],
  providers: [ApiGrafanaRepository, ApiGrafanaService],
})
export class ApiGrafanaModule {}
