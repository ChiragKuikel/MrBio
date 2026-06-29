import sendgrid from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import { isArray } from '@mr-bio/core/shared';
import { EmailAttachment } from '../../app/domain/core/entities/message-template';
import { CommunicationConfigService } from '../../shared/abstractions/communication-config-service';
import {
  EmailCommunicator,
  EmailHelper,
  EmailPayload,
} from '../../shared/abstractions/email-helper';

@Injectable()
export class SendGridHelper implements EmailHelper {
  constructor(private configService: CommunicationConfigService) {
    sendgrid.setApiKey(this.configService.sendGrid.key);
  }

  async send(data: EmailPayload): Promise<string> {
    let receivers: Array<EmailCommunicator> = [];
    if (isArray(data.to)) receivers = receivers.concat(data.to);
    else receivers.push(data.to);
    receivers = receivers.map(receiver => {
      const [username, emailClient] = receiver.email.split('@');
      const usernameWithoutPrefix = username!.includes('+') ? username!.split('+')[0]! : username!;
      receiver.email = usernameWithoutPrefix.concat('@', emailClient!);

      return receiver;
    });

    const response = await sendgrid.send({
      to: receivers,
      html: data.html,
      subject: data.subject,
      attachments: data.attachments ? this._resolveAttachment(data.attachments) : undefined,
      from: data.from ?? {
        name: this.configService.sendGrid.senderName,
        email: this.configService.sendGrid.senderEmail,
      },
    });

    return response[0].toString();
  }

  private _resolveAttachment(attachments: EmailAttachment[]): {
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
    contentId?: string;
  }[] {
    return attachments.map(attachment => ({
      content: attachment.path, // TODO: get data from path
      filename: attachment.name,
      type: attachment['content-type'],
    }));
  }
}
