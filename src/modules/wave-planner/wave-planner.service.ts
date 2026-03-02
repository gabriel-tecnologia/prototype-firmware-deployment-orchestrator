import { Injectable } from '@nestjs/common';
import { CameraDataDto } from '../api-grafana/dto/camera-data.dto';
import { CameraWithDistanceDto } from './dto/camera-with-distance.dto';
import { RolloutPlanDto } from './dto/rollout-plan.dto';
import { WaveDto } from './dto/wave.dto';

@Injectable()
export class WavePlannerService {
  /// Latitude of Gabriel HQ — origin point for all wave radius calculations.
  private readonly centerLat: number;

  /// Longitude of Gabriel HQ — origin point for all wave radius calculations.
  private readonly centerLng: number;

  /// Total number of deployment waves.
  private readonly totalWaves: number;

  /// Number of days between each wave execution.
  private readonly daysPerWave: number;

  /**
   * Alpha controls the aggressiveness of expansion.
   * Lower values produce near-linear growth; higher values concentrate
   * most cameras in the final waves (exponential tail).
   */
  private readonly alpha: number;

  constructor() {
    this.centerLat = -23.5641718;
    this.centerLng = -46.6828659;
    this.totalWaves = 7;
    this.daysPerWave = 2;
    this.alpha = 0.25;
  }

  /**
   * Computes the full rollout plan from the provided camera dataset.
   * Returns both the structured plan and the cameras sorted by distance
   * so the pipeline can forward them to the dashboard without a second pass.
   */
  computePlan(cameras: CameraDataDto[]): {
    plan: RolloutPlanDto;
    enrichedCameras: CameraWithDistanceDto[];
  } {
    const sorted = this.sortByDistance(cameras);
    const waves = this.buildWaves(sorted);

    const plan: RolloutPlanDto = {
      totalCameras: sorted.length,
      centerLat: this.centerLat,
      centerLng: this.centerLng,
      alpha: this.alpha,
      daysPerWave: this.daysPerWave,
      totalWaves: this.totalWaves,
      totalDays: this.totalWaves * this.daysPerWave,
      waves,
    };

    return { plan, enrichedCameras: sorted };
  }

  /**
   * Calculates the great-circle distance in km between two coordinates
   * using the Haversine formula.
   */
  private haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /**
   * Enriches each camera with its distanceKm and returns them
   * sorted ascending by distance from the center.
   */
  private sortByDistance(cameras: CameraDataDto[]): CameraWithDistanceDto[] {
    return cameras
      .map((c) => ({
        ...c,
        distanceKm: this.haversineKm(
          this.centerLat,
          this.centerLng,
          c.Latitude,
          c.Longitude,
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  /**
   * Returns the exponential fraction of cameras to cover at wave k.
   * Formula: (e^(α·k) − 1) / (e^(α·N) − 1)
   * where N = totalWaves.
   */
  private expFrac(k: number): number {
    return (
      (Math.exp(this.alpha * k) - 1) /
      (Math.exp(this.alpha * this.totalWaves) - 1)
    );
  }

  /**
   * Builds the ordered list of WaveDtos from the distance-sorted camera array.
   * The radius of each wave is determined empirically: it is the distance
   * of the camera at position floor(frac * total) in the sorted array.
   */
  private buildWaves(sorted: CameraWithDistanceDto[]): WaveDto[] {
    const total = sorted.length;
    const waves: WaveDto[] = [];
    let prevCumulative = 0;

    for (let k = 1; k <= this.totalWaves; k++) {
      const frac = Math.min(this.expFrac(k), 1);
      const idx = Math.min(Math.floor(frac * total), total - 1);
      const radiusKm = sorted[idx].distanceKm;
      const cumulativeCameras = Math.min(Math.round(frac * total), total);
      const camerasInWave = cumulativeCameras - prevCumulative;

      waves.push({
        wave: k,
        day: k * this.daysPerWave,
        radiusKm: parseFloat(radiusKm.toFixed(2)),
        camerasInWave,
        cumulativeCameras,
        fraction: parseFloat(frac.toFixed(4)),
        percentageCoverage: parseFloat((frac * 100).toFixed(2)),
      });

      prevCumulative = cumulativeCameras;
    }

    return waves;
  }
}
