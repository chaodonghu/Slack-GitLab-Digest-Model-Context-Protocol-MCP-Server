import _createClient from "openapi-fetch";
import type { paths } from "./types.ts";

export type API = ReturnType<typeof _createClient<paths>>;

export const createClient: typeof _createClient<paths> = (...args) =>
  _createClient<paths>(...args);

export * from "./types.ts";