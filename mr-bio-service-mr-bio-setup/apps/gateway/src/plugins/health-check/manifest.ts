import * as Eg from 'express-gateway';
import healthCheckPolicy from './policies/health-check';

const plugin: Eg.ExpressGateway.Plugin = {
  version: '1.0.0',
  policies: ['health-check'],
  schema: {
    $id: 'http://express-gateway.io/schemas/plugin/health-check.json',
  },
  init: pluginContext => {
    pluginContext.registerPolicy(healthCheckPolicy);
  },
};

export = plugin;
