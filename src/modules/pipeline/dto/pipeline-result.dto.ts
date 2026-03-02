import { CameraWithDistanceDto } from '../../wave-planner/dto/camera-with-distance.dto';
import { RolloutPlanDto } from '../../wave-planner/dto/rollout-plan.dto';

/// Full result of a pipeline refresh cycle.
export interface PipelineResultDto {
  /// Camera list sorted by distance from the origin, each enriched with distanceKm.
  cameras: CameraWithDistanceDto[];

  /// Rollout plan computed by the WavePlanner from the fresh camera dataset.
  plan: RolloutPlanDto;
}
