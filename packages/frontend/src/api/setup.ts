import { SenderParam } from 'framework-ui/src/api';

export const API_URL = '/api';
export type SenderParamNoUrl<T = any> = Omit<SenderParam<T>, 'url' | 'method'>;
