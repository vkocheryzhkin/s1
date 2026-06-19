import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateUser } from '@services/user-slice';

import type { AppDispatch, RootState } from '@services/store';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element | null => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const { isLoading } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const isChanged = name !== user.name || email !== user.email || password !== '';

  const handleCancel = (): void => {
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setIsSaved(false);
  };

  const handleSave = (event: React.FormEvent): void => {
    event.preventDefault();
    void dispatch(updateUser({ name, email, password })).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setPassword('');
        setIsSaved(true);
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSave}>
      <Input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setIsSaved(false);
        }}
        extraClass="mb-6"
      />
      <EmailInput
        placeholder="Логин"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setIsSaved(false);
        }}
        extraClass="mb-6"
      />
      <PasswordInput
        placeholder="Пароль"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setIsSaved(false);
        }}
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
