import {FC, ReactNode} from "react";

import styles from './nav-link.module.css';

interface INavLink {
    to: string;
    icon: ReactNode;
    text: string;
    active?: boolean;
}

const NavLink: FC<INavLink> = ({ to, icon, text, active }) => {
    return (
        <a
            href={to}
            className={`${styles.link} text text_type_main-default ${active ? 'text_color_primary' : 'text_color_inactive'}`}
        >
            {icon}
            <span>{text}</span>
        </a>
    );
};

export { NavLink };
