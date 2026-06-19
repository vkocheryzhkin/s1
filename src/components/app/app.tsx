import { ProtectedRoute } from '@hocs/protected-route/protected-route';
import { ResetPasswordRoute } from '@hocs/reset-password-route/reset-password-route';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { ProfileLayout } from '@pages/profile/profile-layout';
import { ProfileOrdersPage } from '@pages/profile/profile-orders-page';
import { ProfilePage } from '@pages/profile/profile-page';
import { RegisterPage } from '@pages/register/register';
import { checkUserAuth } from '@services/user-slice';

import type { AppDispatch, RootState } from '@services/store';

import styles from './app.module.css';

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
        ],
      },
    ],
  },
  { path: '/', element: <Home /> },
  { path: '/ingredients/:id', element: <IngredientDetailsPage /> },
  { path: '/feed', element: <FeedPage /> },
  { path: '*', element: <NotFound404 /> },
];

const modalRouteConfig = [
  { path: '/ingredients/:id', element: <IngredientDetailsModal /> },
];

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const background = (location.state as { background?: Location } | null)?.background;
  const { isAuthChecked } = useSelector((state: RootState) => state.user);

  const mainRoutes = useRoutes(appRouteConfig, background ?? location);
  const modalRoutes = useRoutes(modalRouteConfig, location);

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  if (!isAuthChecked) {
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
      {background && modalRoutes}
    </div>
  );
};

export default App;
