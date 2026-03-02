export class ApiCameraRepository {
    /**
     * Authenticates on the camera via Digest Auth.
     * Stores the CSRF token and session cookie returned in the response headers.
     * Endpoint: POST /API/Web/Login
     */
    async login(_username: string, _password: string): Promise<void> {
        throw new Error('Not implemented');
    }

    /**
     * Sends a heartbeat to keep the authenticated session alive.
     * Endpoint: POST /API/Login/Heartbeat
     */
    async heartbeat(): Promise<void> {
        throw new Error('Not implemented');
    }

    /**
     * Sets the firmware source URL on the camera server.
     * Endpoint: POST /API/Maintenance/FtpUpgrade/Set
     */
    async setUpgradeSource(_firmwareUrl: string): Promise<void> {
        throw new Error('Not implemented');
    }

    /**
     * Checks whether a new firmware version is available at the configured source.
     * Endpoint: POST /API/Maintenance/FtpUpgrade/Check
     */
    async checkUpgrade(): Promise<Record<string, unknown>> {
        throw new Error('Not implemented');
    }

    /**
     * Retrieves the base64 salt and iteration count used for PBKDF2 key derivation.
     * Endpoint: POST /API/Maintenance/TransKey/Get
     */
    async getTransKey(): Promise<{ base64Salt: string; iterations: number }> {
        throw new Error('Not implemented');
    }

    /**
     * Sends the upgrade command with the PBKDF2-derived cipher.
     * Endpoint: POST /API/Maintenance/FtpUpgrade/Upgrade
     */
    async upgrade(_cipher: string): Promise<unknown> {
        throw new Error('Not implemented');
    }
}
