export type QueryValue = string | string[] | undefined;

export interface VercelRequest {
  method?: string;
  query: Record<string, QueryValue>;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(statusCode: number): VercelResponse;
  json(body: unknown): void;
  end(): void;
}
