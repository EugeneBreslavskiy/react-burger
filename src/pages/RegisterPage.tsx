import { useState, useCallback, useMemo, FormEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../services/store';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FormContainer } from '../components/FormContainer/FormContainer';
import { UserForm } from '../components/UserForm/UserForm';
import { registerUser } from '../services/authActions';
import { Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { PageSection } from '../components/PageSection/PageSection';

export const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [formState, setFormState] = useState({ name: '', email: '', password: '' });

  const setName = useCallback((value: string) => {
    setFormState(prev => ({ ...prev, name: value }));
  }, []);

  const setEmail = useCallback((value: string) => {
    setFormState(prev => ({ ...prev, email: value }));
  }, []);

  const setPassword = useCallback((value: string) => {
    setFormState(prev => ({ ...prev, password: value }));
  }, []);

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await dispatch(registerUser({
      email: formState.email,
      password: formState.password,
      name: formState.name,
    })).unwrap().catch(() => null);

    if (!response?.success) return;

    const from = (location.state as any)?.from?.pathname || '/';

    navigate(from, { replace: true });
  }, [dispatch, formState.email, formState.password, formState.name, location, navigate]);

  const nav = useMemo(() => ([
    <div key="login" className="text text_type_main-default">
      Уже зарегистрированы? <Link to="/login">Войти</Link>
    </div>
  ]), []);

  const AnyInput: any = Input;

  return (
    <PageSection>
      <FormContainer>
        <UserForm
          title="Регистрация"
          submitText="Зарегистрироваться"
          endpoint="auth/register"
          email={formState.email}
          password={formState.password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={onSubmit}
          nav={nav}
        >
          <div className="mb-6">
            <AnyInput
              type="text"
              placeholder="Имя"
              value={formState.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              name="name"
              required
              autoComplete="name"
              size="default"
            />
          </div>
        </UserForm>
      </FormContainer>
    </PageSection>
  );
};


