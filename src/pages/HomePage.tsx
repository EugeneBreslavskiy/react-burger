import React, { FC, PropsWithChildren } from 'react';
import { PageSection } from '../components/PageSection/PageSection';

export const HomePage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PageSection>
      {children}
    </PageSection>
  );
};


