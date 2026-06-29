import { Gender } from '../enum/gender';
import { ContactType, EmailType, PhoneType } from '../enum';

export interface IName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface IAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  location?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface IPhoneValue {
  value: string;
  countryISO?: string; // For eg: US for US
  countryCode?: string; // For eg: 1 for US
}
export interface IPhone extends IPhoneValue {
  type: PhoneType;
}

export interface IEmail {
  type: EmailType;
  value: string;
}

export interface IContact {
  name?: string;
  phone?: IPhoneValue;
  email?: string;
  type: ContactType;
}

export interface IDemographic {
  name: IName;
  gender: Gender;
  dob?: string;
  address?: IAddress;
}

export interface IUserSecurity {
  password?: string;
  passwordHistory?: string[];
  loginAttempted?: number;
  lastLoginDate?: Date;
  enableMFA?: boolean;
}
