import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked } = useAppSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to="/" replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
