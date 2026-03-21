import { appContent } from '../constants/content';

export const routes = {
  login: '/auth/login',
  register: '/auth/register',
  pass: '/pass',
  profile: '/profile',
  settings: '/settings',
} as const;

export const defaultPrivateRoute = routes.pass;

export const primaryNavigation = [
  {
    href: routes.pass,
    label: appContent.navigation.pass.label,
    description: appContent.navigation.pass.description,
  },
  {
    href: routes.profile,
    label: appContent.navigation.profile.label,
    description: appContent.navigation.profile.description,
  },
  {
    href: routes.settings,
    label: appContent.navigation.settings.label,
    description: appContent.navigation.settings.description,
  },
] as const;
