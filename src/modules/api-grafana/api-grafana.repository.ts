import { CameraDataDto } from './dto/camera-data.dto';
import * as cameraData from './response_clean.json';

export class ApiGrafanaRepository {
  /**
   * Fetches raw camera data from the Grafana datasource API.
   * Endpoint: POST /api/ds/query
   *
   * Currently returns static JSON as a prototype stub.
   * Replace this implementation with a real HTTP call when integrating with Grafana.
   */
  async fetchCameras(): Promise<CameraDataDto[]> {
    return cameraData as CameraDataDto[];
  }
}
