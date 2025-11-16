import React, { FC, PropsWithChildren } from 'react';

export const HomePage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section>
      {children}
    </section>
  );
};


