/// Represents a single deployment wave in the rollout plan.
export interface WaveDto {
  /// Wave number (1-based).
  wave: number;

  /// Day of execution (wave * daysPerWave).
  day: number;

  /// Empirical radius in km — the distance to the farthest camera reached in this wave.
  radiusKm: number;

  /// Incremental number of cameras added in this wave.
  camerasInWave: number;

  /// Cumulative cameras covered up to and including this wave.
  cumulativeCameras: number;

  /// Coverage fraction of total cameras (0 to 1).
  fraction: number;

  /// Coverage expressed as a percentage (0 to 100).
  percentageCoverage: number;
}
