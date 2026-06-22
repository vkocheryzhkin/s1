import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { useForm } from '@hooks/useForm';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { updateUser } from '@services/user/user-actions';

import type { ChangeEvent } from 'react';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element | null => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const { isLoading } = useAppSelector((state) => state.user);
  const { values, handleChange, setValues } = useForm({
    name: '',
    email: '',
    password: '',
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setValues({ name: user.name, email: user.email, password: '' });
    }
  }, [user, setValues]);

  if (!user) {
    return null;
  }

  const isChanged =
    values.name !== user.name || values.email !== user.email || values.password !== '';

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    handleChange(event);
    setIsSaved(false);
  };

  const handleCancel = (): void => {
    setValues({ name: user.name, email: user.email, password: '' });
    setIsSaved(false);
  };

  const handleSave = (event: React.FormEvent): void => {
    event.preventDefault();
    void dispatch(updateUser(values)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setValues({ ...values, password: '' });
        setIsSaved(true);
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSave}>
      <Input
        type="text"
        name="name"
        placeholder="Имя"
        value={values.name}
        onChange={handleInputChange}
        extraClass="mb-6"
      />
      <EmailInput
        name="email"
        placeholder="Логин"
        value={values.email}
        onChange={handleInputChange}
        extraClass="mb-6"
      />
      <PasswordInput
        name="password"
        placeholder="Пароль"
        value={values.password}
        onChange={handleInputChange}
        extraClass="mb-6"
      />
      {isChanged && (
        <div className={`${styles.actions} mb-6`}>
          <button
            type="button"
            className={`${styles.action} text text_type_main-default`}
            onClick={handleCancel}
          >
            Отмена
          </button>
          <Button htmlType="submit" type="primary" size="medium">
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
      {isSaved && !isChanged && (
        <p className={`${styles.message} text text_type_main-default`}>
          Данные успешно обновлены
        </p>
      )}
    </form>
  );
};
