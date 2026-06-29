import { EventTopic } from '@mr-bio/core/shared';
import TriggerPoint from '../enums/trigger-point';

export const eventTopicTriggerPointsMap: Partial<Record<EventTopic, TriggerPoint[]>> = {
  [EventTopic.RESET_PASSWORD]: [TriggerPoint.RESET_PASSWORD],
  [EventTopic.ACCOUNT_ACTIVATION]: [TriggerPoint.ACCOUNT_ACTIVATION],
  [EventTopic.LOGIN_OTP_GENERATED]: [TriggerPoint.LOGIN_OTP_GENERATED],
};
