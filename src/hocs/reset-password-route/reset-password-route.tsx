import { Navigate } from 'react-router-dom';

import { ResetPasswordPage } from '@pages/reset-password/reset-password';
import { isResetPasswordAllowed } from '@utils/token';

export const ResetPasswordRoute = (): React.JSX.Element => {
  if (!isResetPasswordAllowed()) {
    return <Navigate to="/forgot-password" replace />;
  }

  return <ResetPasswordPage />;
};
