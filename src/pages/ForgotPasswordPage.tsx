import { useState, useCallback, FormEvent } from 'react';
import { FormContainer } from '../components/FormContainer/FormContainer';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../services/store';
import { requestPasswordReset } from '../services/passwordActions';
import { UserForm } from '../components/UserForm/UserForm';
import { PageSection } from '../components/PageSection/PageSection';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await dispatch(requestPasswordReset({ email })).unwrap().catch(() => null);

    if (!result?.success) return;

    sessionStorage.setItem('forgotPasswordVisited', 'true');

    navigate('/reset-password');
  }, [dispatch, email, navigate]);

  return (
    <PageSection>
      <FormContainer>
        <UserForm
          title="Восстановление пароля"
          submitText="Восстановить"
          endpoint="password-reset"
          email={email}
          password=""
          onEmailChange={setEmail}
          onPasswordChange={() => { }}
          onSubmit={onSubmit}
          showPassword={false}
          nav={
            <div className="text text_type_main-default" style={{ marginTop: 80, textAlign: 'center' }}>
              Вспомнили пароль? <Link to="/login">Войти</Link>
            </div>
          }
        />
      </FormContainer>
    </PageSection>
  );
};


