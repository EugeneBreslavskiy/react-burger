import { FC } from "react";
import { NavLink as RouterNavLink, Link } from "react-router-dom";
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from "@ya.praktikum/react-developer-burger-ui-components";

import styles from "./nav.module.css";
import navLinkStyles from "../NavLink/nav-link.module.css";

interface NavLinkSchema {
  to: string;
  IconComponent: typeof BurgerIcon;
  text: string;
  end?: boolean;
}

const NavLink: FC<NavLinkSchema> = ({ to, IconComponent, text, end }) => {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${navLinkStyles.link} text text_type_main-default ${isActive ? 'text_color_primary' : 'text_color_inactive'}`
      }
    >
      {({ isActive }) => (
        <>
          <IconComponent type={isActive ? 'primary' : 'secondary'} />
          <span>{text}</span>
        </>
      )}
    </RouterNavLink>
  );
};

const Nav: FC = () => {
  return (
    <nav className={styles.nav} aria-label="Навигация Stellar Burgers">
      <ul className={styles.list}>
        <li><NavLink to={'/'} IconComponent={BurgerIcon} text={'Конструктор'} end /></li>
        <li><NavLink to={'/feed'} IconComponent={ListIcon} text={'Лента заказов'} /></li>
      </ul>
      <Link to="/" className={styles.logo}>
        <Logo />
      </Link>
      <ul className={`${styles.list} ${styles.listEnd}`}>
        <li><NavLink to={'/profile'} IconComponent={ProfileIcon} text={'Личный кабинет'} /></li>
      </ul>
    </nav>
  );
}

export { Nav }
