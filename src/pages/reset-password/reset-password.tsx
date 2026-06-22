import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/useForm';
import { request } from '@utils/request';
import { clearResetPasswordAllowed } from '@utils/token';

import type { TMessageResponse, TPasswordResetConfirmRequest } from '@utils/types';

import styles from './reset-password.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { values, handleChange } = useForm({ password: '', token: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setIsLoading(true);

    void request<TMessageResponse>('/password-reset/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values satisfies TPasswordResetConfirmRequest),
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
          name="password"
          placeholder="Введите новый пароль"
          value={values.password}
          onChange={handleChange}
          extraClass="mb-6"
        />
        <Input
          type="text"
          name="token"
          placeholder="Введите код из письма"
          value={values.token}
          onChange={handleChange}
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
