import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { request } from '@utils/request';
import { clearResetPasswordAllowed } from '@utils/token';

import type { TMessageResponse, TPasswordResetConfirmRequest } from '@utils/types';

import styles from './reset-password.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setIsLoading(true);

    void request<TMessageResponse>('/password-reset/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, token } satisfies TPasswordResetConfirmRequest),
    })
      .then((data) => {
        if (data.success) {
          clearResetPasswordAllowed();
          void navigate('/login', { replace: true });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordInput
          placeholder="Введите новый пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          extraClass="mb-6"
        />
        <Input
          type="text"
          placeholder="Введите код из письма"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          extraClass="mb-6"
        />
        <Button htmlType="submit" type="primary" size="medium" extraClass="mb-20">
          {isLoading ? 'Загрузка...' : 'Сохранить'}
        </Button>
      </form>
      <div className={`${styles.links} text text_type_main-default`}>
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </div>
    </main>
  );
};
