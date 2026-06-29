export type GrantableEntity = {
  code: string;
  isGranted: boolean;
  permissions?: GrantableEntity[];
};
