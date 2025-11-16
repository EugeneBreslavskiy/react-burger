import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ProfileSidebar.module.css';

type Props = {
  to: string;
  end?: boolean;
  children: React.ReactNode;
};

export const SidebarLink: React.FC<Props> = ({ to, end, children }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
    >
      <span className="text text_type_main-medium">{children}</span>
    </NavLink>
  );
};


