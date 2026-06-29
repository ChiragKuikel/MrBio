import { BaseSchema } from '@mr-bio/core/external-lib';
import { Environment, ExceptionLevel, HttpMethod } from '@mr-bio/core/shared';

export type ExceptionLogSchema = {
  exceptionLogId: string;
  timestamp: Date; // When the error occurred
  // application for which the end point was called
  application: {
    name: string;
    id: string;
  };
  environment: Environment; // Environment (e.g., dev, staging, production)
  level: ExceptionLevel; // Severity level (e.g., ERROR, WARN, INFO)
  message: string; // Short error message or summary
  // Captures HTTP request details
  request: {
    method: HttpMethod; // HTTP method (e.g., GET, POST)
    url: string; // URL of the request
    headers: Record<string, any>; // Request headers
    body: any; // Request payload (if applicable)
    queryParams: Record<string, any>; // Query parameters (if applicable)
    ipAddress: string; // IP address of the requester
  };
  // Captures HTTP response details
  response?: {
    statusCode: number; // HTTP status code
    headers?: Record<string, any>; // Response headers
  };
  // User details (if applicable)
  user?: {
    userId?: string; // Unique identifier for the user
    email?: string; // Email of the user
    roles: string[]; // Roles or permissions associated with the user
  };
  // Detailed exception information
  exception: {
    type: string; // Exception type or name
    message: string; // Exception message
    stackTrace?: string; // Full stack trace (redundant with top-level stackTrace)
  };
  // Additional metadata for debugging
  meta?: {
    service: string; // Name of the microservice/module
    host: string; // Hostname or server name
    tags: string[]; // Custom tags (e.g., feature names, trace IDs)
    correlationId?: string; // Correlation ID for tracing across services
  };
} & BaseSchema;
