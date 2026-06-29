import { BaseEntity, getUUID } from '@mr-bio/core/shared';

export class Session extends BaseEntity {
  userId: string;
  deviceId: string;
  revoked: boolean;
  remember: boolean;

  initialize(builder: { userId: string; remember?: boolean; deviceId?: string }) {
    this.userId = builder.userId;
    this.deviceId = builder.deviceId ?? getUUID();
    this.revoked = false;
    this.remember = builder.remember ?? false;
  }

  revoke() {
    this.revoked = true;
  }
}
