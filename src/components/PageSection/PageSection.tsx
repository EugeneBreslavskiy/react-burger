import { FC, PropsWithChildren } from 'react';
import styles from './PageSection.module.css';

export const PageSection: FC<PropsWithChildren> = ({ children }) => {
  return <section className={styles.pageSection}>{children}</section>;
};


