import { lazyLoad } from 'utils/loadable';

export const CreateEventPage = lazyLoad(
  () => import('./CreateEventPage'),
  module => module.default,
);
