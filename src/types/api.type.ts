import { Picture } from './picture.type';

export type Loading = { kind: 'LOADING' };
export type Success = { kind: 'SUCCESS'; pictures: Picture[] };
export type Failure = { kind: 'FAILURE'; error: string };

export type PictureStatus = Loading | Success | Failure;
