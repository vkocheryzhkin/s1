import { ProtectedRoute } from '@hocs/protected-route/protected-route';
import { ResetPasswordRoute } from '@hocs/reset-password-route/reset-password-route';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { FeedPage } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { Home } from '@pages/home/home';
import {
  IngredientDetailsModal,
  IngredientDetailsPage,
} from '@pages/ingredient-details/ingredient-details-page';
import { LoginPage } from '@pages/login/login';
import { NotFound404 } from '@pages/not-found-404/not-found-404';
import { OrderInfoModal } from '@pages/order-info/order-info-page';
import { ProfileLayout } from '@pages/profile/profile-layout';
import { ProfileOrdersPage } from '@pages/profile/profile-orders-page';
import { ProfilePage } from '@pages/profile/profile-page';
import { RegisterPage } from '@pages/register/register';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/ingredients-slice';
import { checkUserAuth } from '@services/user-slice';

import type { Location } from 'react-router-dom';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

const isFeedOrderRoute = (pathname: string): boolean => /^\/feed\/\d+$/.test(pathname);

const isProfileOrderRoute = (pathname: string): boolean =>
  /^\/profile\/orders\/\d+$/.test(pathname);

const getOrderModalBackground = (pathname: string): Location | undefined => {
  if (isFeedOrderRoute(pathname)) {
    return { pathname: '/feed', search: '', hash: '', state: null, key: 'default' };
  }

  if (isProfileOrderRoute(pathname)) {
    return {
      pathname: '/profile/orders',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    };
  }

  return undefined;
};

const appRouteConfig = [
  {
    element: <ProtectedRoute onlyUnAuth />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordRoute /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/profile',
        element: <ProfileLayout />,
        children: [
          { index: true, element: <ProfilePage /> },
          { path: 'orders', element: <ProfileOrdersPage /> },
          { path: 'orders/:id', element: <ProfileOrdersPage /> },
        ],
      },
    ],
  },
  { path: '/', element: <Home /> },
  { path: '/ingredients/:id', element: <IngredientDetailsPage /> },
  { path: '/feed', element: <FeedPage /> },
  { path: '/feed/:id', element: <FeedPage /> },
  { path: '*', element: <NotFound404 /> },
];

const modalRouteConfig = [
  { path: '/ingredients/:id', element: <IngredientDetailsModal /> },
  { path: '/feed/:id', element: <OrderInfoModal source="feed" /> },
  { path: '/profile/orders/:id', element: <OrderInfoModal source="profile" /> },
];

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const stateBackground = (location.state as TLocationState | null)?.background;
  const orderModalBackground = getOrderModalBackground(location.pathname);
  const backgroundLocation = stateBackground ?? orderModalBackground;
  const { isAuthChecked } = useAppSelector((state) => state.user);
  const { isLoading: isIngredientsLoading } = useAppSelector(
    (state) => state.ingredients
  );

  const mainRoutes = useRoutes(appRouteConfig, backgroundLocation ?? location);
  const modalRoutes = useRoutes(modalRouteConfig, location);

  useEffect(() => {
    void dispatch(checkUserAuth());
    void dispatch(fetchIngredients());
  }, [dispatch]);

  if (!isAuthChecked || isIngredientsLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <main className={styles.preloader}>
          <Preloader />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      {mainRoutes}
      {backgroundLocation && modalRoutes}
    </div>
  );
};

export default App;
