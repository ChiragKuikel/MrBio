import { Environment, HttpMethod } from '../enum';

export type LatencyLog = {
  timestamp: Date;
  endpoint: string;
  method: HttpMethod;
  responseTimeMs: number;
  statusCode: number;
  environment: Environment;
  application: {
    name: string;
    id: string;
  };
  request?: {
    headers?: Record<string, any>;
    queryParams?: Record<string, any>;
    body?: Record<string, any>;
  };
  user?: {
    userId: string;
    roles: string[];
    ipAddress: string;
  };
  meta?: {
    tags?: string[]; // Tags for classification
    correlationId?: string; // Correlation ID for tracing
  };
};
