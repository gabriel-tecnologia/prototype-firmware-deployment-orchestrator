import { Module } from '@nestjs/common';
import { DashboardModule } from './modules/dashboard/dashboard.module';

// Future modules — uncomment as each service is implemented:
// import { ApiCameraModule } from './modules/api-camera/api-camera.module';
// import { ApiTunnelsModule } from './modules/api-tunnels/api-tunnels.module';
// import { ApiBifrostModule } from './modules/api-bifrost/api-bifrost.module';
// import { ApiGrafanaModule } from './modules/api-grafana/api-grafana.module';
// import { CameraDiscoveryModule } from './modules/camera-discovery/camera-discovery.module';
// import { WavePlannerModule } from './modules/wave-planner/wave-planner.module';
// import { PipelineModule } from './modules/pipeline/pipeline.module';
// import { FirmwareUpdaterModule } from './modules/firmware-updater/firmware-updater.module';
// import { DateManagerModule } from './modules/date manager/date-manager.module';

@Module({
  imports: [
    DashboardModule,

    // ApiCameraModule,
    // ApiTunnelsModule,
    // ApiBifrostModule,
    // ApiGrafanaModule,
    // CameraDiscoveryModule,
    // WavePlannerModule,
    // PipelineModule,
    // FirmwareUpdaterModule,
    // DateManagerModule,
  ],
})
export class AppModule {}
