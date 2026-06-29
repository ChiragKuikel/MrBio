import { IEmailClientConfig } from '../../config/type';

export abstract class CommunicationConfigService {
  abstract get sendGrid(): IEmailClientConfig;
}
