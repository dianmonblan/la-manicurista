import { env } from 'process';
import { name } from 'package.json';

export enum NODE_ENV {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
export const APLICATION_DEBUG_NAME = env.DEBUG?.split(':')?.[0] || name;
export enum API_RESOURCES_PREFIX {
  TYPEAHEAD = 'typeahead',
}
