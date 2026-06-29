import * as Eg from 'express-gateway';

const healthCheckPolicy: Eg.ExpressGateway.Policy = {
  name: 'health-check',
  schema: {
    type: 'object',
    $id: 'http://express-gateway.io/schemas/policy/health-check.json',
  },
  policy: () => {
    return (req, res, next) => {
      if (req.path === '/api/gateway/health') {
        res.status(200).json({
          data: null,
          message: 'Mr Bio gateway API up and running! v2',
          timestamp: new Date().toISOString(),
        });
      } else {
        next();
      }
    };
  },
};

export default healthCheckPolicy;
