export class PipelineRepository {
  /**
   * Persists a pipeline execution record.
   * Intended for future integration with a database or external storage.
   */
  async saveExecution(_executedAt: Date): Promise<void> {
    throw new Error('Not implemented');
  }
}
