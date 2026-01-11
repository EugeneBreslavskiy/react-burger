import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateUser } from '../services/authActions';
import { PageSection } from '../components/PageSection/PageSection';
import { ProfileLayout } from '../components/ProfileLayout/ProfileLayout';
import { ProfileSidebar } from '../components/ProfileSidebar/ProfileSidebar';
import { Container } from '../components/Container/Container';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import pageSectionStyles from '../components/PageSection/PageSection.module.css';

interface ProfileForm {
  name: string;
  email: string;
  password: string;
}

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  const [initialForm, setInitialForm] = useState<ProfileForm>(() => ({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  }));

  const [form, setForm] = useState<ProfileForm>(() => ({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  }));

  useEffect(() => {
    if (user) {
      const newInitialForm: ProfileForm = {
        name: user.name,
        email: user.email,
        password: '',
      };
      setInitialForm(newInitialForm);
      if (form.name === initialForm.name && form.email === initialForm.email && form.password === '') {
        setForm(newInitialForm);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name, user?.email]);

  const hasChanges = useMemo(() => {
    return form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.password !== initialForm.password;
  }, [form, initialForm]);

  const handleCancel = () => {
    setForm(initialForm);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUser({
        name: form.name,
        email: form.email,
        password: form.password || undefined,
      })).unwrap();

      // Обновляем initialForm после успешного сохранения
      setInitialForm({
        name: form.name,
        email: form.email,
        password: '',
      });
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      console.error('Не удалось обновить профиль:', err);
    }
  };

  return (
    <PageSection className={pageSectionStyles.pageSectionWithPadding}>
      <Container>
        <ProfileLayout sidebar={<ProfileSidebar />}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6">
              {/* @ts-expect-error UI lib typing mismatch */}
              <Input
                type="text"
                placeholder="Имя"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                name="name"
                autoComplete="name"
              />
            </div>
            <div className="mb-6">
              {/* @ts-expect-error UI lib typing mismatch */}
              <Input
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                name="email"
                autoComplete="email"
              />
            </div>
            <div className="mb-6">
              <PasswordInput
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                name="password"
                autoComplete="current-password"
              />
            </div>
            {hasChanges && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button
                  htmlType="button"
                  type="secondary"
                  size="large"
                  onClick={handleCancel}
                  disabled={loading === 'pending'}
                >
                  Отменить
                </Button>
                <Button
                  htmlType="button"
                  type="primary"
                  size="large"
                  onClick={handleSave}
                  disabled={loading === 'pending'}
                >
                  {'Сохранить'}
                </Button>
              </div>
            )}
          </form>
        </ProfileLayout>
      </Container>
    </PageSection>
  );
};


