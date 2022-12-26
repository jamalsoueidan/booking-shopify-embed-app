import { Suspense, lazy, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

const lazyLoadRoutes = (componentName: string) => {
  const LazyElement = lazy(() => import(`./pages/${componentName}`));

  // Wrapping around the suspense component is mandatory
  return (
    <Suspense fallback="Loading...">
      <LazyElement />
    </Suspense>
  );
};

/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.globEager(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @return {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `pages`
 */
export default ({ pages }: any) => {
  const routes = useMemo(() => useBuildRoutes(pages), [pages]);
  return useRoutes(routes);
};

const useBuildRoutes = (pages: any) => {
  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace('./pages', '')
        .replace(/\.([tj])sx?$/, '')
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, '/')
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

      if (path.endsWith('/') && path !== '/') {
        path = path.substring(0, path.length - 1);
      }

      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      return {
        path: path.toLowerCase(),
        name: path.substring(1).toLowerCase(),
        element: lazyLoadRoutes(path.substring(1)),
      };
    })
    .filter((route) => route.element);

  return routes;
};
