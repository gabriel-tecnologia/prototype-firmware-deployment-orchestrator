import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiCameraService } from './api-camera.service';
import { ApiCameraRepository } from './api-camera.repository';

@Module({
  imports: [HttpModule],
  exports: [ApiCameraService],
  providers: [ApiCameraRepository, ApiCameraService],
})
export class ApiCameraModule {}
