export type LoginDto = {
  /**
   * Used to identify the user. Could be `email` or `username`
   */
  username: string;
  password: string;
  remember?: boolean;
};

export type GetLoginUserDto = {
  token: string;
};
