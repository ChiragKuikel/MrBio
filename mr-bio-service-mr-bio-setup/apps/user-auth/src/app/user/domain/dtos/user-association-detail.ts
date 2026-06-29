import { AssociatedResource } from '../../../../shared/types/associated-resource';

export type UserAssociationDetail = {
  resources?: AssociatedResource[];
  roles?: {
    code: string;
    name: string;
    resources: AssociatedResource[];
  }[];
};
