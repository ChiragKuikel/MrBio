import { AuthGrantType } from '@mr-bio/core/shared';
import { Privileges } from '../../../../shared/types/privilege';

export type ClientWithGrantedPrivileges = {
  id: string;
  tokenId: string;
  allowedSources: string[];
  grantedPrivileges: Privileges;
  grantType: AuthGrantType.CLIENT_CREDENTIALS;
  organizationId: string;
  organizationName: string;
  networkIds?: string[];
};
