import { AnyObj } from '@mr-bio/core/shared';
import { MessageReceiver, MessageSender } from '../core/entities/message';

export type SendMessageDto = {
  payload: AnyObj;
  sender?: MessageSender;
  receivers: MessageReceiver[];
  saveMessage?: boolean;
};
