import { Injectable } from '@nestjs/common';
import { UserSchema } from '../schemas/user-schema';
import { User } from '../../domain/core/entities/user';
import { UserQueryOptions } from '../../domain/dtos/user-query';
import { HashedValue } from '../../../../shared/value-objects/hashed-value';
import { AnyObj, BasePersistenceMapper, DBQuery, withoutEmptyValues } from '@mr-bio/core/shared';

@Injectable()
export class UserPersistenceMapper extends BasePersistenceMapper<User, UserSchema> {
  domainToPersistence(domain: User): UserSchema {
    return {
      userId: domain.id,
      email: domain.email,
      phones: domain.phones,
      status: domain.status,
      username: domain.username,
      association: domain.association,
      demographic: {
        dob: domain.dob,
        gender: domain.gender,
        address: domain.address,
        name: {
          lastName: domain.lastName,
          firstName: domain.firstName,
          middleName: domain.middleName,
        },
      },
      security: {
        enableMFA: domain.enableMFA,
        password: domain.password?.hash,
        loginAttempts: domain.loginAttempts,
        lastLoginDate: domain.lastLoginDate,
        passwordHistory: domain.passwordHistory?.map(ph => ph.hash),
      },

      created: domain.created,
      updated: domain.updated,
    };
  }

  persistenceToDomain(persistence: UserSchema): User {
    const domain = new User(persistence.userId);
    domain.username = persistence.username;
    domain.email = persistence.email;
    domain.phones = persistence.phones;
    domain.status = persistence.status;

    // demographics
    domain.firstName = persistence.demographic.name.firstName;
    domain.middleName = persistence.demographic.name.middleName;
    domain.lastName = persistence.demographic.name.lastName;
    domain.dob = persistence.demographic.dob;
    domain.gender = persistence.demographic.gender;
    domain.address = persistence.demographic.address;

    // security
    domain.loginAttempts = persistence.security?.loginAttempts;
    domain.lastLoginDate = persistence.security?.lastLoginDate;
    if (persistence.security?.password)
      domain.password = new HashedValue(persistence.security.password);
    if (persistence.security?.passwordHistory)
      domain.passwordHistory = persistence.security?.passwordHistory.map(ph => new HashedValue(ph));
    domain.enableMFA = persistence.security?.enableMFA ?? false;

    domain.association = persistence.association!;

    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }

  updateDomainToPeristence(domain: Partial<User>): Partial<UserSchema> | AnyObj {
    return withoutEmptyValues({
      email: domain.email,
      phones: domain.phones,
      'demographic.dob': domain.dob,
      'demographic.gender': domain.gender,
      'demographic.address': domain.address,
      'security.enableMFA': domain.enableMFA,
      'demographic.name.lastName': domain.lastName,
      'demographic.name.firstName': domain.firstName,
      'demographic.name.middleName': domain.middleName,
    } as Partial<UserSchema>);
  }

  mapQuery(query: UserQueryOptions): DBQuery<UserSchema> {
    return withoutEmptyValues({
      ...query,
      email: query.email,
      // phones: query.phones,
      status: query.status,
      'association.roles': query.role,
      'demographic.name.lastName': query.lastName,
      'demographic.name.firstName': query.firstName,
    } as DBQuery<UserSchema>);
  }
}
