import { env } from "$env/dynamic/public";

export function appendURL(path: string): string {
  return new URL(path, env.PUBLIC_API_BASE_URL).toString();
}
