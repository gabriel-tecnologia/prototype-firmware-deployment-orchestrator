import { Injectable } from '@nestjs/common';

import { ApiCameraRepository } from './api-camera.repository';

@Injectable()
export class ApiCameraService {
  constructor(private readonly repository: ApiCameraRepository) {}

  /**
   * Authenticates on the camera via Digest Auth.
   * Stores the CSRF token and session cookie returned in the response headers.
   */
  async login(username: string, password: string): Promise<void> {
    return this.repository.login(username, password);
  }

  /**
   * Sends a heartbeat to keep the authenticated session alive.
   */
  async heartbeat(): Promise<void> {
    return this.repository.heartbeat();
  }

  /**
   * Sets the firmware source URL on the camera server.
   */
  async setUpgradeSource(firmwareUrl: string): Promise<void> {
    return this.repository.setUpgradeSource(firmwareUrl);
  }

  /**
   * Checks whether a new firmware version is available at the configured source.
   */
  async checkUpgrade(): Promise<Record<string, unknown>> {
    return this.repository.checkUpgrade();
  }

  /**
   * Retrieves the base64 salt and iteration count used for PBKDF2 key derivation.
   */
  async getTransKey(): Promise<{ base64Salt: string; iterations: number }> {
    return this.repository.getTransKey();
  }

  /**
   * Sends the upgrade command with the PBKDF2-derived cipher.
   */
  async upgrade(cipher: string): Promise<unknown> {
    return this.repository.upgrade(cipher);
  }
}
