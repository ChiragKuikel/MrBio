import { Injectable } from '@nestjs/common';
import { Logger } from '@mr-bio/core/shared';
import { SmsHelper, SmsPayload } from '../../shared/abstractions/sms-helper';

@Injectable()
export class TwilioSmsHelper implements SmsHelper {
  constructor(private logger: Logger) {}
  async send(data: SmsPayload): Promise<string> {
    this.logger.info('Sending SMS', data);

    return '';
  }
}
