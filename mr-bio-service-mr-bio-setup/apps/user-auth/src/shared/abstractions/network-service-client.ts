import { ServiceOption } from '@mr-bio/core/shared';
import { Network, Organization } from '../service-client-responses/service-client-network';

export abstract class NetworkServiceClient {
  abstract getOrganizationById(id: string, option?: ServiceOption): Promise<Organization>;
  abstract getNetworkById(id: string, option?: ServiceOption): Promise<Network>;
}
