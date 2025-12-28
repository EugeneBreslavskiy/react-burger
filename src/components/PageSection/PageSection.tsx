import { FC, PropsWithChildren } from 'react';
import styles from './PageSection.module.css';

interface PageSectionSchema extends PropsWithChildren {
  className?: string;
}

export const PageSection: FC<PageSectionSchema> = ({ children, className }) => {
  const classNames = className
    ? `${styles.pageSection} ${className}`
    : styles.pageSection;

  return <section className={classNames}>{children}</section>;
};


