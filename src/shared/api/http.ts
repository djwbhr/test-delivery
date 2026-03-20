import { env } from '../config/env';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (!path.startsWith('/')) {
    return `${env.apiBaseUrl}/${path}`;
  }

  return `${env.apiBaseUrl}${path}`;
}

export async function apiGet<T extends JsonValue>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'GET',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return (await response.json()) as T;
}
