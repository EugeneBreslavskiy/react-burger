import { useState, useCallback, FormEvent } from 'react';
import { FormContainer } from '../components/FormContainer/FormContainer';
import { PasswordInput, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../services/store';
import { resetPassword } from '../services/passwordActions';
import { UserForm } from '../components/UserForm/UserForm';
import { PageSection } from '../components/PageSection/PageSection';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formState, setFormState] = useState({ password: '', code: '' });
  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const resp = await dispatch(resetPassword({ password: formState.password, token: formState.code })).unwrap().catch(() => null);
    if (!resp?.success) return;
    sessionStorage.removeItem('forgotPasswordVisited');
    navigate('/login', { replace: true });
  }, [dispatch, formState.password, formState.code, navigate]);

  return (
    <PageSection>
      <FormContainer>
        <UserForm
          title="Сброс пароля"
          submitText="Сохранить"
          endpoint="password-reset/reset"
          email=""
          password={formState.password}
          onEmailChange={() => { }}
          onPasswordChange={(v) => setFormState(prev => ({ ...prev, password: v }))}
          onSubmit={onSubmit}
          showEmail={false}
          children={
            <div style={{ marginBottom: 24 }}>
              {/** @ts-expect-error UI lib typing mismatch */}
              <Input
                type="text"
                placeholder="Код из e-mail"
                value={formState.code}
                onChange={(e) => setFormState(prev => ({ ...prev, code: e.target.value }))}
                name="code"
                required
                autoComplete="one-time-code"
              />
            </div>
          }
          nav={
            <div style={{ marginTop: 80, textAlign: 'center' }} className="text text_type_main-default">
              Вспомнили пароль? <Link to="/login">Войти</Link>
            </div>
          }
        />
      </FormContainer>
    </PageSection>
  );
};


