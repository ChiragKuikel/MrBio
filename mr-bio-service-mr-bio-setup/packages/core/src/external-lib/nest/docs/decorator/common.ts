import { ApiHeader } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  CLIENT_ASSIGNER_HEADER,
  ORGANIZATION_ID_HEADER,
  REFRESH_TOKEN_HEADER,
  VERIFICATION_TOKEN_HEADER,
} from '../../../../shared';

/**
 * Adds swagger documentation for the following headers used for super admin:
 * 1. `x-org-id`
 */
export function SuperAdminHeaderDoc() {
  return applyDecorators(
    ApiHeader({
      name: ORGANIZATION_ID_HEADER,
      required: false,
      example: '63253DC3-1D0C-4015-82AC-178949C5EDF5',
    })
  );
}

export function VerificationTokenHeaderDoc() {
  return applyDecorators(
    ApiHeader({
      name: VERIFICATION_TOKEN_HEADER,
      required: true,
    })
  );
}

export function ClientAssignerHeaderDoc() {
  return applyDecorators(
    ApiHeader({
      name: CLIENT_ASSIGNER_HEADER,
      required: false,
      example: JSON.stringify({
        at: '2025-02-11T00:00:00.000Z',
        by: 'John Doe',
        id: '3ef17160-5e8e-46e6-b463-9cc5d94ed1a2',
      }),
    })
  );
}

export function RefreshTokenHeaderDoc() {
  return applyDecorators(
    ApiHeader({
      name: REFRESH_TOKEN_HEADER,
      required: false,
    })
  );
}
