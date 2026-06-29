import { CreateLatencyLogDto } from '../../dtos/create-latency-log';
import { BaseEntity, Environment, HttpMethod, ILogApplication } from '@mr-bio/core/shared';

export class LatencyLog extends BaseEntity {
  timestamp: Date; // ISODate
  endpoint: string; // Full API endpoint
  method: HttpMethod; // HTTP method (e.g., GET, POST, etc.)
  responseTimeMs: number; // Response time in milliseconds
  statusCode: number; // HTTP status code
  environment: Environment; // Environment (e.g., dev, staging, production)
  application: ILogApplication; // Application details
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

  initialize(createDto: CreateLatencyLogDto) {
    this.timestamp = createDto.timestamp;
    this.endpoint = createDto.endpoint;
    this.method = createDto.method;
    this.responseTimeMs = createDto.responseTimeMs;
    this.statusCode = createDto.statusCode;
    this.application = createDto.application;
    this.request = createDto.request;
    this.user = createDto.user;
    this.meta = createDto.meta;
    this.environment = createDto.environment;
  }
}
