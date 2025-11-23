import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../services/store';
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
  const user = useSelector((state: RootState) => state.auth.user);

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
      setForm(newInitialForm);
    }
  }, [user]);

  const hasChanges = useMemo(() => {
    return form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.password !== initialForm.password;
  }, [form, initialForm]);

  const handleCancel = () => {
    setForm(initialForm);
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
                <Button htmlType="button" type="secondary" size="large" onClick={handleCancel}>
                  Отменить
                </Button>
                <Button htmlType="button" type="primary" size="large">
                  Сохранить
                </Button>
              </div>
            )}
          </form>
        </ProfileLayout>
      </Container>
    </PageSection>
  );
};


