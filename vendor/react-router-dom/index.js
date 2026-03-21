import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const RouterContext = createContext(null);
const OutletContext = createContext(null);

const splitPath = (path) =>
  path
    .replace(/^#+/, '')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean);
const normalizePath = (path) => {
  const clean = path.replace(/^#+/, '').replace(/\/$/, '');
  return clean ? (clean.startsWith('/') ? clean : `/${clean}`) : '/';
};
const joinSegments = (segments) =>
  `/${segments.filter(Boolean).join('/')}`.replace(/\/+/g, '/') || '/';
const isPrefix = (full, prefix) =>
  prefix.every((segment, index) => full[index] === segment);

const parseHashLocation = (value) => {
  const clean = (value || '/').replace(/^#+/, '') || '/';
  const [rawPathname, rawSearch = ''] = clean.split('?');
  const pathname = normalizePath(rawPathname || '/');
  const search = rawSearch ? `?${rawSearch}` : '';

  return { pathname, search };
};

const formatHashLocation = (to) => {
  const { pathname, search } = parseHashLocation(to);
  return `${pathname}${search}`;
};

function matchRoutes(routes, pathname, baseSegments = []) {
  const targetSegments = splitPath(pathname);

  for (const route of routes) {
    if (route.index) {
      if (targetSegments.length === baseSegments.length) {
        return [route];
      }
      continue;
    }

    const path = route.path ?? '';
    if (path === '*') {
      return [route];
    }

    const ownSegments = path ? splitPath(path) : [];
    const routeSegments = path.startsWith('/')
      ? ownSegments
      : [...baseSegments, ...ownSegments];

    if (route.children) {
      if (path === '' || isPrefix(targetSegments, routeSegments)) {
        const matchedChildren = matchRoutes(
          route.children,
          pathname,
          routeSegments,
        );
        if (matchedChildren) {
          return route.element ? [route, ...matchedChildren] : matchedChildren;
        }
      }
    }

    if (joinSegments(routeSegments) === normalizePath(pathname)) {
      return route.element ? [route] : [];
    }
  }

  return null;
}

function renderBranch(branch) {
  let outlet = null;
  for (let index = branch.length - 1; index >= 0; index -= 1) {
    const route = branch[index];
    if (!route.element) continue;
    outlet = React.createElement(
      OutletContext.Provider,
      { value: outlet },
      route.element,
    );
  }
  return outlet;
}

function useHashLocation() {
  const [location, setLocation] = useState(() =>
    parseHashLocation(window.location.hash.slice(1) || '/'),
  );

  useEffect(() => {
    const onHashChange = () =>
      setLocation(parseHashLocation(window.location.hash.slice(1) || '/'));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return [location, setLocation];
}

export function createHashRouter(routes) {
  return { routes };
}

export function RouterProvider({ router }) {
  const [location, setLocation] = useHashLocation();
  const navigate = useMemo(
    () =>
      (to, options = {}) => {
        const next = parseHashLocation(to);
        const hash = `#${formatHashLocation(to)}`;
        if (options.replace) {
          window.location.replace(
            `${window.location.pathname}${window.location.search}${hash}`,
          );
          setLocation(next);
          return;
        }
        window.location.hash = formatHashLocation(to);
      },
    [setLocation],
  );

  const branch = matchRoutes(router.routes, location.pathname) ?? [];
  const content = renderBranch(branch);

  return React.createElement(
    RouterContext.Provider,
    { value: { ...location, navigate } },
    content,
  );
}

export function Navigate({ to, replace = false }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);
  return null;
}

export function Outlet() {
  return useContext(OutletContext);
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context)
    throw new Error('useNavigate must be used within RouterProvider');
  return context.navigate;
}

export function useLocation() {
  const context = useContext(RouterContext);
  if (!context)
    throw new Error('useLocation must be used within RouterProvider');
  return { pathname: context.pathname, search: context.search };
}

export function useSearchParams() {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = useMemo(
    () =>
      (nextInit, navigateOptions = {}) => {
        const nextSearch = new URLSearchParams(nextInit).toString();
        navigate(
          `${pathname}${nextSearch ? `?${nextSearch}` : ''}`,
          navigateOptions,
        );
      },
    [navigate, pathname],
  );

  return [searchParams, setSearchParams];
}

function BaseLink(
  { to, onClick, children, className, ...props },
  resolveClassName,
) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const href = `#${formatHashLocation(to)}`;
  const nextClassName =
    typeof resolveClassName === 'function'
      ? resolveClassName({
          isActive: pathname === normalizePath(parseHashLocation(to).pathname),
        })
      : className;

  return React.createElement(
    'a',
    {
      ...props,
      href,
      className: nextClassName,
      onClick: (event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        navigate(to);
      },
    },
    children,
  );
}

export function Link(props) {
  return BaseLink(props, props.className);
}

export function NavLink(props) {
  return BaseLink(props, props.className);
}
