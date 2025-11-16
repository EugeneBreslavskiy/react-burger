import React, { FC, PropsWithChildren } from 'react';
import styles from './ProfileLayout.module.css';

export const ProfileLayout: FC<PropsWithChildren<{ sidebar: React.ReactNode }>> = ({ sidebar, children }) => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
};


