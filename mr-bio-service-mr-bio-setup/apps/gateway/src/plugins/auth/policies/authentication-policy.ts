import * as Eg from 'express-gateway';
import { HttpRequest } from '@mr-bio/core/shared';
import { AuthenticationGuard } from '../../../guards/authentication-guard';

const authenticationPolicy: Eg.ExpressGateway.Policy = {
  name: 'authentication',
  schema: {
    type: 'object',
    $id: 'http://express-gateway.io/schemas/policy/authentication.json',
  },
  policy: actionParams => {
    const unprotectedRoutes = actionParams.unprotectedRoutes;

    const authenticationGuard = new AuthenticationGuard();

    return (req, res, next) => {
      return authenticationGuard.activate(req as HttpRequest, res, next, unprotectedRoutes);
    };
  },
};

export default authenticationPolicy;
