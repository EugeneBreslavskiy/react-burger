import React from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../services/store';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { UserForm } from '../components/UserForm/UserForm';
import { FormContainer } from '../components/FormContainer/FormContainer';
import { loginUser } from '../services/authActions';

export const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [formState, setFormState] = React.useState({ email: '', password: '' });

  const setEmail = React.useCallback((value: string) => {
    setFormState(prev => ({ ...prev, email: value }));
  }, []);

  const setPassword = React.useCallback((value: string) => {
    setFormState(prev => ({ ...prev, password: value }));
  }, []);

  const onSubmit = React.useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await dispatch(loginUser({ email: formState.email, password: formState.password })).unwrap().catch(() => null);

    if (!response?.success) return;

    const from = (location.state as any)?.from?.pathname || '/';

    navigate(from, { replace: true });
  }, [dispatch, formState.email, formState.password, location, navigate]);

  const nav = React.useMemo(() => ([
    <div key="register" className="text text_type_main-default">
      Вы — новый пользователь? <Link to="/register">Зарегистрироваться</Link>
    </div>,
    <div key="forgot" className="text text_type_main-default">
      Забыли пароль? <Link to="/forgot-password">Восстановить пароль</Link>
    </div>
  ]), []);

  return (
    <section>
      <FormContainer>
        <UserForm
          title="Вход"
          submitText="Войти"
          endpoint="auth/login"
          email={formState.email}
          password={formState.password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={onSubmit}
          nav={nav}
        />
      </FormContainer>
    </section>
  );
};


