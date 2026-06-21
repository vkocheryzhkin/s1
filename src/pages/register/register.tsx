import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { useForm } from '@hooks/useForm';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { registerUser } from '@services/user-slice';

import styles from './register.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.user);
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    void dispatch(registerUser(values));
  };

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Имя"
          value={values.name}
          onChange={handleChange}
          extraClass="mb-6"
        />
        <EmailInput
          name="email"
          placeholder="E-mail"
          value={values.email}
          onChange={handleChange}
          extraClass="mb-6"
        />
        <PasswordInput
          name="password"
          placeholder="Пароль"
          value={values.password}
          onChange={handleChange}
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
