import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { request } from '@utils/request';
import { setResetPasswordAllowed } from '@utils/token';

import type { TMessageResponse, TPasswordResetRequest } from '@utils/types';

import styles from './forgot-password.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setIsLoading(true);

    void request<TMessageResponse>('/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email } satisfies TPasswordResetRequest),
    })
      .then((data) => {
        if (data.success) {
          setResetPasswordAllowed();
          void navigate('/reset-password', { replace: true });
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
        <EmailInput
          placeholder="Укажите e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          extraClass="mb-6"
        />
        <Button htmlType="submit" type="primary" size="medium" extraClass="mb-20">
          {isLoading ? 'Загрузка...' : 'Восстановить'}
        </Button>
      </form>
      <div className={`${styles.links} text text_type_main-default`}>
        <Link to="/login" className={styles.link}>
          Вспомнили пароль?
        </Link>
      </div>
    </main>
  );
};
