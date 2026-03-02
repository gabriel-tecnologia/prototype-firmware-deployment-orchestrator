import { CameraDataDto } from '../../api-grafana/dto/camera-data.dto';

/// Camera enriched with its Haversine distance to the rollout origin point.
export interface CameraWithDistanceDto extends CameraDataDto {
  distanceKm: number;
}
