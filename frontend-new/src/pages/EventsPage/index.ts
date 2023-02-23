import { lazyLoad } from 'utils/loadable';

export const EventsPage = lazyLoad(
  () => import('./EventsPage'),
  module => module.default,
);
