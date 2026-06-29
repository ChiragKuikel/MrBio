import * as Eg from 'express-gateway';
import authenticationPolicy from './policies/authentication-policy';

const plugin: Eg.ExpressGateway.Plugin = {
  version: '1.0.0',
  policies: ['authentication'],
  schema: {
    $id: 'http://express-gateway.io/schemas/plugin/auth.json',
  },
  init: pluginContext => {
    pluginContext.registerPolicy(authenticationPolicy);
  },
};

export = plugin;
