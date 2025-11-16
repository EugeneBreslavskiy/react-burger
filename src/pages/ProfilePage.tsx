import React from 'react';
import { PageSection } from '../components/PageSection/PageSection';
import { ProfileLayout } from '../components/ProfileLayout/ProfileLayout';
import { ProfileSidebar } from '../components/ProfileSidebar/ProfileSidebar';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';

export const ProfilePage = () => {
  const [form, setForm] = React.useState({ name: 'Марκ', email: 'mail@stellar.burgers', password: '******' });

  return (
    <PageSection>
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
          <Button htmlType="button" type="primary" size="large">
            Сохранить
          </Button>
        </form>
      </ProfileLayout>
    </PageSection>
  );
};


