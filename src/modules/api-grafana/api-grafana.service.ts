import { Injectable } from '@nestjs/common';
import { CameraDataDto } from './dto/camera-data.dto';
import { ApiGrafanaRepository } from './api-grafana.repository';
import * as cameraData from './response_clean.json';

@Injectable()
export class ApiGrafanaService {
  constructor(private readonly repository: ApiGrafanaRepository) {}

  /**
   * Returns the locally cached list of cameras (static JSON).
   */
  getCameras(): CameraDataDto[] {
    return cameraData as CameraDataDto[];
  }

  /**
   * Triggers a fresh fetch from the Grafana datasource API via the repository.
   */
  async refreshCameras(): Promise<CameraDataDto[]> {
    return this.repository.fetchCameras();
  }
}
