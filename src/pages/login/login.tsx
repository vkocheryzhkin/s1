import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '@services/user-slice';

import type { AppDispatch, RootState } from '@services/store';

import styles from './login.module.css';

type TLocationState = {
  from?: {
    pathname: string;
  };
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    void dispatch(loginUser({ email, password })).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        const from = (location.state as TLocationState | null)?.from?.pathname ?? '/';
        void navigate(from, { replace: true });
      }
    });
  };

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          extraClass="mb-6"
        />
        <PasswordInput
          placeholder="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          extraClass="mb-6"
        />
        <Button htmlType="submit" type="primary" size="medium" extraClass="mb-20">
          {isLoading ? 'Загрузка...' : 'Войти'}
        </Button>
      </form>
      <div className={`${styles.links} text text_type_main-default mb-4`}>
        <span className="text text_type_main-default text_color_inactive mr-2">
          Вы — новый пользователь?
        </span>
        <Link to="/register" className={styles.link}>
          Зарегистрироваться
        </Link>
      </div>
      <div className={`${styles.links} text text_type_main-default`}>
        <Link to="/forgot-password" className={styles.link}>
          Восстановить пароль
        </Link>
      </div>
    </main>
  );
};
