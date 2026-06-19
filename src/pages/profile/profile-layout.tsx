import { LogoutIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

import { logoutUser } from '@services/user-slice';

import type { AppDispatch } from '@services/store';

import styles from './profile-layout.module.css';

export const ProfileLayout = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = (): void => {
    void dispatch(logoutUser());
  };

  return (
    <main className={styles.container}>
      <nav className={styles.menu}>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${isActive ? styles.link_active : ''}`
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${isActive ? styles.link_active : ''}`
          }
        >
          История заказов
        </NavLink>
        <button
          type="button"
          className={`${styles.logout} text text_type_main-medium`}
          onClick={handleLogout}
        >
          <LogoutIcon type="secondary" />
          <span className="ml-2">Выход</span>
        </button>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  );
};
