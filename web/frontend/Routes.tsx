import {
  ComponentType,
  LazyExoticComponent,
  Suspense,
  lazy,
  useState,
} from 'react';
import { Routes as ReactRouterRoutes, Route } from 'react-router-dom';

interface CustomRoute {
  path: string;
  element: LazyExoticComponent<ComponentType<any>>;
  children?: CustomRoute[];
}

/*const routes: CustomRoute[] = [
  {
    path: '/bookings',
    element: lazy(() => import(`./pages/Bookings.tsx`)),
    children: [
      {
        path: '/new',
        element: lazy(() => import(`./pages/Bookings/New.tsx`)),
      },
    ],
  },
  {
    path: '/collections',
    element: lazy(() => import(`./pages/Collections.tsx`)),
  },
  {
    path: '/existiframe',
    element: lazy(() => import(`./pages/ExitIframe.tsx`)),
  },
  {
    path: '/',
    element: lazy(() => import(`./pages/index.tsx`)),
  },
  {
    path: '/settings',
    element: lazy(() => import(`./pages/Settings.tsx`)),
  },
  {
    path: '/staff',
    element: lazy(() => import(`./pages/Staff.tsx`)),
  },
];

const createRoutes = ({ path, element: Component }: CustomRoute) => {
  return (
    <Route
      key={path}
      path={path}
      element={
        <Suspense>
          <Component />
        </Suspense>
      }
    />
  );
};*/

export default function Routes() {
  //const routesComponents = routes.map(createRoutes);

  const oneDepth = (one: string) =>
    lazy(() => import(`./pages/${one.replace('.tsx', '')}.tsx`));
  const twoDepth = (one: string, two: string) =>
    lazy(() => import(`./pages/${one}/${two.replace('.tsx', '')}.tsx`));
  const threeDepth = (one: string, two: string, three: string) =>
    lazy(
      () => import(`./pages/${one}/${two}/${three.replace('.tsx', '')}.tsx`)
    );

  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)', {
    as: 'raw',
  });

  const routes: Array<{
    path: string;
    element: LazyExoticComponent<ComponentType<any>>;
  }> = [];

  Object.keys(pages).forEach(function (key) {
    const length = key.match(/\//g).length - 1;
    let element = null;
    if (length === 1) {
      element = oneDepth(key.split('/').at(-1));
    }

    if (length === 2) {
      element = twoDepth(key.split('/').at(-2), key.split('/').at(-1));
    }

    if (length === 3) {
      element = threeDepth(
        key.split('/').at(-3),
        key.split('/').at(-2),
        key.split('/').at(-1)
      );
    }

    let path = key
      .toLowerCase()
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

    routes.push({
      path,
      element,
    });
  });

  console.log(routes);
  const [components] = useState(() =>
    routes.map(({ path, element: Component }) => (
      <Route
        key={path}
        path={path}
        element={
          <Suspense fallback={<>Loading</>}>
            <Component />
          </Suspense>
        }
      />
    ))
  );

  return <ReactRouterRoutes>{components}</ReactRouterRoutes>;
}
