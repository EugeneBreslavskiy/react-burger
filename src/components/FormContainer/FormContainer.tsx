import { FC, PropsWithChildren } from 'react';
import styles from './form-container.module.css';

export const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.FormContainer}>{children}</div>;
};


