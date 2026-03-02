/// Represents the different API endpoints for camera operations.
export enum APICameraEndpoints {
  /**
   * Endpoint for login.
   */
  Login = '/API/Web/Login',

  /**
   * Endpoint for logout.
   */
  Logout = '/API/Web/Logout',

  /**
   * Endpoint for getting device information.
   */
  DeviceInfo = '/API/Login/DeviceInfo/Get',

  /**
   * Endpoint for sending heartbeats.
   */
  HeartBeat = '/API/Login/Heartbeat',

  /**
   * Endpoint for setting the firmware upgrade source (FTP).
   */
  FtpUpgradeSet = '/API/Maintenance/FtpUpgrade/Set',

  /**
   * Endpoint for checking if a new firmware version is available.
   */
  FtpUpgradeCheck = '/API/Maintenance/FtpUpgrade/Check',

  /**
   * Endpoint for triggering the firmware upgrade.
   */
  FtpUpgradeUpgrade = '/API/Maintenance/FtpUpgrade/Upgrade',

  /**
   * Endpoint for retrieving the TransKey cipher (used for upgrade authentication).
   */
  TransKeyGet = '/API/Maintenance/TransKey/Get',

}
