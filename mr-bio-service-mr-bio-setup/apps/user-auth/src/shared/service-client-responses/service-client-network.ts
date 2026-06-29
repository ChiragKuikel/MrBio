export enum NetworkPrivilege {
  MODERATOR = 'moderator',
  SUBSCRIBER = 'subscriber',
}

export type OrganizationNetwork = {
  code: string;
  id: string;
  privilege: NetworkPrivilege;
};

export type Organization = {
  id: string;
  code: string;
  name: string;
  networks: OrganizationNetwork[];
};

export type Network = {
  id: string;
  code: string;
  name: string;
};
