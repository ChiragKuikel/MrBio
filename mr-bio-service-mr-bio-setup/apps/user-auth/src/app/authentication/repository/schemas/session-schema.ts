import { BaseSchema } from '@mr-bio/core/external-lib';

export interface ISession {
  sessionId: string;
  userId: string;
  deviceId: string;
  revoked: boolean;
  remember: boolean;
}

export type SessionSchema = ISession & BaseSchema;
