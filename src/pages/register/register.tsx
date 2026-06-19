import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { registerUser } from '@services/user-slice';

import type { AppDispatch, RootState } from '@services/store';

import styles from './register.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    void dispatch(registerUser({ name, email, password }));
  };

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(event) => setName(event.target.value)}
          extraClass="mb-6"
        />
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
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>
      </form>
      <div className={`${styles.links} text text_type_main-default`}>
        <span className="text text_type_main-default text_color_inactive mr-2">
          Уже зарегистрированы?
        </span>
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </div>
    </main>
  );
};
