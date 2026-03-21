import type { AnchorHTMLAttributes, PropsWithChildren, ReactNode } from 'react';

export interface RouteObject {
  path?: string;
  index?: boolean;
  element?: ReactNode;
  children?: RouteObject[];
}

export interface Router {
  routes: RouteObject[];
}

export function createHashRouter(routes: RouteObject[]): Router;
export function RouterProvider(props: { router: Router }): ReactNode;
export function Navigate(props: { to: string; replace?: boolean }): null;
export function Outlet(): ReactNode;
export function useNavigate(): (to: string, options?: { replace?: boolean }) => void;
export function useLocation(): { pathname: string };
export function Link(props: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>): ReactNode;
export function NavLink(props: PropsWithChildren<Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & { to: string; className?: string | ((args: { isActive: boolean }) => string | undefined) }>): ReactNode;
