import type { PostgrestError } from "@supabase/supabase-js";

export class DataAccessError extends Error {
  readonly code: string | null;
  readonly details: string | null;

  constructor(message: string, error?: PostgrestError | null) {
    super(message, { cause: error ?? undefined });
    this.name = "DataAccessError";
    this.code = error?.code ?? null;
    this.details = error?.details ?? null;
  }
}

export const throwIfDataError = (
  error: PostgrestError | null,
  message: string,
): void => {
  if (error) {
    throw new DataAccessError(message, error);
  }
};

export const requireData = <T>(
  data: T | null,
  error: PostgrestError | null,
  message: string,
): T => {
  throwIfDataError(error, message);

  if (data === null) {
    throw new DataAccessError(message);
  }

  return data;
};
