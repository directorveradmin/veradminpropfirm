import { randomUUID } from 'node:crypto';

export type RequestCorrelationContext = {
  correlationId: string;
};

const REQUEST_CORRELATION_HEADERS = ['x-request-id', 'x-correlation-id'] as const;
const MAX_CORRELATION_ID_LENGTH = 128;
const VALID_CORRELATION_ID_PATTERN = /^[A-Za-z0-9._:-]+$/;

function normalizeCorrelationId(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > MAX_CORRELATION_ID_LENGTH) {
    return null;
  }

  if (!VALID_CORRELATION_ID_PATTERN.test(normalized)) {
    return null;
  }

  return normalized;
}

export function createRequestCorrelationId(): string {
  return randomUUID();
}

export function resolveRequestCorrelationId(
  request?: Pick<Request, 'headers'> | null,
): string {
  if (request?.headers) {
    for (const headerName of REQUEST_CORRELATION_HEADERS) {
      const headerValue = normalizeCorrelationId(request.headers.get(headerName));

      if (headerValue) {
        return headerValue;
      }
    }
  }

  return createRequestCorrelationId();
}