export abstract class SmsHelper {
  abstract send(data: SmsPayload): Promise<string>;
}

export type SmsPayload = {
  receiver: string | string[];
  title: string;
  content: string;
};
