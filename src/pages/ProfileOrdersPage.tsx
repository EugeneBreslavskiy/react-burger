import { FC } from 'react';
import { PageSection } from '../components/PageSection/PageSection';
import { ProfileLayout } from '../components/ProfileLayout/ProfileLayout';
import { ProfileSidebar } from '../components/ProfileSidebar/ProfileSidebar';

export const ProfileOrdersPage: FC = () => {
  return (
    <PageSection>
      <ProfileLayout sidebar={<ProfileSidebar />}>
        <h1 className="text text_type_main-large">История заказов</h1>
        <p className="text text_type_main-default">Раздел будет реализован в следующем спринте.</p>
      </ProfileLayout>
    </PageSection>
  );
};


