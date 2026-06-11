/**
 * Mock service for managing notification preferences
 */
export interface NotificationPreferences {
  emailAlertsHigh: boolean;
  emailAlertsCritical: boolean;
  dailyDigest: boolean;
  inAppNotifications: boolean;
}

export class NotificationService {
  private static mockDelay = 500;
  
  private static currentPreferences: NotificationPreferences = {
    emailAlertsHigh: false,
    emailAlertsCritical: true,
    dailyDigest: true,
    inAppNotifications: true,
  };

  static async getPreferences(): Promise<NotificationPreferences> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...this.currentPreferences });
      }, this.mockDelay);
    });
  }

  static async updatePreferences(prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentPreferences = { ...this.currentPreferences, ...prefs };
        resolve({ ...this.currentPreferences });
      }, this.mockDelay);
    });
  }
}
