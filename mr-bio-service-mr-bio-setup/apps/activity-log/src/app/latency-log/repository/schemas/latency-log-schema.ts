import { BaseSchema } from '@mr-bio/core/external-lib';
import { Environment, HttpMethod } from '@mr-bio/core/shared';

export interface ILatencyLog {
  latencyLogId: string;
  timestamp: Date; // ISODate
  endpoint: string; // Full API endpoint
  method: HttpMethod; // HTTP method (e.g., GET, POST, etc.)
  responseTimeMs: number; // Response time in milliseconds
  statusCode: number; // HTTP status code
  environment: Environment; // Environment (e.g., dev, staging, production)
  application: {
    name: string;
    id: string;
  }; // Application details
  request?: {
    headers?: Record<string, any>; // Request headers (optional)
    queryParams?: Record<string, any>; // Query parameters (optional)
    body?: Record<string, any>; // Request payload (optional)
  }; // Request details (optional)
  user?: {
    userId: string; // Unique user ID (if applicable)
    roles: string[]; // User roles or permissions
    ipAddress: string; // User's IP address
  }; // User information (optional)
  meta?: {
    tags?: string[]; // Tags for classification
    correlationId?: string; // Correlation ID for tracing
  }; // Metadata (optional)
}

export type LatencyLogSchema = ILatencyLog & BaseSchema;
