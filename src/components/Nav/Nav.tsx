import {FC} from "react";
import {NavLink} from "../NavLink/NavLink";
import {Logo, BurgerIcon, ListIcon, ProfileIcon} from "@ya.praktikum/react-developer-burger-ui-components";

import styles from "./nav.module.css";

const Nav: FC = () => {
    return (
        <nav className={styles.nav} aria-label="Навигация Stellar Burgers">
            <ul className={styles.list}>
                <li><NavLink to={'/'} icon={<BurgerIcon type="primary"/>} text={'Конструктор'} active={true}/></li>
                <li><NavLink to={'/'} icon={<ListIcon type="secondary"/>} text={'Лента заказов'}/></li>
            </ul>
            <Logo className={styles.logo}/>
            <ul className={`${styles.list} ${styles.listEnd}`}>
                <li><NavLink to={'/'} icon={<ProfileIcon type="secondary"/>} text={'Личный кабинет'}/></li>
            </ul>
        </nav>
    );
}

export {Nav}
