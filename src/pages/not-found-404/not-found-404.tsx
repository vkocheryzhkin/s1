import { Link } from 'react-router-dom';

export const NotFound404 = (): React.JSX.Element => {
  return (
    <main className="mt-10 pl-5">
      <h1 className="text text_type_main-large mb-5">404</h1>
      <p className="text text_type_main-default mb-10">
        Страница не найдена. Возможно, вы перешли по неверной ссылке.
      </p>
      <Link to="/" className="text text_type_main-default text_color_accent">
        Вернуться на главную
      </Link>
    </main>
  );
};
