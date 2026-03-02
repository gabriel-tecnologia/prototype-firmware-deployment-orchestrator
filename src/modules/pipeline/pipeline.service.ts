import { Injectable } from '@nestjs/common';
import { ApiGrafanaService } from '../api-grafana/api-grafana.service';
import { WavePlannerService } from '../wave-planner/wave-planner.service';
import { PipelineResultDto } from './dto/pipeline-result.dto';

@Injectable()
export class PipelineService {
  constructor(
    private readonly apiGrafanaService: ApiGrafanaService,
    private readonly wavePlannerService: WavePlannerService,
  ) {}

  /**
   * Orchestrates a full refresh cycle in order:
   * 1. Fetches fresh camera data from the Grafana datasource.
   * 2. Passes the dataset to the WavePlanner to compute the rollout plan
   *    and enrich each camera with its distance from the origin.
   * 3. Returns a PipelineResultDto containing both cameras and the plan,
   *    ready to be consumed by the dashboard.
   */
  async refresh(): Promise<PipelineResultDto> {
    const cameras = await this.apiGrafanaService.refreshCameras();
    const { plan, enrichedCameras } = this.wavePlannerService.computePlan(cameras);
    return { cameras: enrichedCameras, plan };
  }
}
