import { WaveDto } from './wave.dto';

/// Full rollout plan computed from the camera dataset.
export interface RolloutPlanDto {
  /// Total number of cameras in the park.
  totalCameras: number;

  /// Latitude of the origin point (Gabriel HQ).
  centerLat: number;

  /// Longitude of the origin point (Gabriel HQ).
  centerLng: number;

  /// Alpha parameter controlling expansion aggressiveness.
  alpha: number;

  /// Number of days between each wave.
  daysPerWave: number;

  /// Total number of waves.
  totalWaves: number;

  /// Total duration of the rollout in days.
  totalDays: number;

  /// Ordered list of wave plans.
  waves: WaveDto[];
}
