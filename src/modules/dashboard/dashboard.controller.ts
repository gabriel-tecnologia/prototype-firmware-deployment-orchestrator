import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { ApiGrafanaService } from '../api-grafana/api-grafana.service';
import { PipelineService } from '../pipeline/pipeline.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly apiGrafanaService: ApiGrafanaService,
    private readonly pipelineService: PipelineService,
  ) {}

  @Get()
  index(@Res() res: Response) {
    return res.sendFile(
      join(__dirname, 'layout', 'dashboard.layout.html')
    );
  }

  @Get('cameras')
  getCameras() {
    return this.apiGrafanaService.getCameras();
  }

  /**
   * Triggers the pipeline to fetch the latest camera data from Grafana.
   * The response is only returned after the pipeline completes the refresh.
   */
  @Post('refresh')
  async refresh() {
    return this.pipelineService.refresh();
  }
}