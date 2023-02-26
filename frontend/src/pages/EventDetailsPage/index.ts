import { lazyLoad } from 'utils/loadable';

export const EventDetailsPage = lazyLoad(
  () => import('./EventDetailsPage'),
  module => module.default,
);
