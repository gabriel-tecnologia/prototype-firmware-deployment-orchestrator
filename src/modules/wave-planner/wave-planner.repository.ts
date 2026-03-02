import { RolloutPlanDto } from './dto/rollout-plan.dto';

export class WavePlannerRepository {
  /**
   * Persists a computed rollout plan.
   * Intended for future integration with a database or external storage.
   */
  async savePlan(_plan: RolloutPlanDto): Promise<void> {
    throw new Error('Not implemented');
  }

  /**
   * Retrieves the last persisted rollout plan.
   * Intended for future integration with a database or external storage.
   */
  async getLastPlan(): Promise<RolloutPlanDto | null> {
    throw new Error('Not implemented');
  }
}
