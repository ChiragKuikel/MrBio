import { IName, IPhone, UnauthorizedException } from '@mr-bio/core/shared';

export class MfaUser {
  constructor(private _details: MfaUserDetail) {}

  get asAuthenticated(): AuthenticatedMfaUser {
    const { id, name, email, phone } = this.details;

    if (!this.isAuthenticated) {
      throw new UnauthorizedException();
    }

    return { id: id!, name: name!, email: email!, phone };
  }

  get asAnonymous(): AnonymousMfaUser {
    const { email, phone } = this.details;

    return { email, phone };
  }

  get details(): MfaUserDetail {
    return this._details;
  }

  get isAuthenticated(): boolean {
    const { id, name, email } = this.details;

    if (id && name && email) return true;

    return false;
  }
}

export type MfaUserDetail = {
  id?: string;
  name?: IName;
  email?: string;
  phone?: IPhone;
};

export type AuthenticatedMfaUser = {
  id: string;
  name: IName;
  email: string;
  phone?: IPhone;
};

export type AnonymousMfaUser = {
  email?: string;
  phone?: IPhone;
};
