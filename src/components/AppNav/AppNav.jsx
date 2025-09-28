import styles from "./nav.module.css";
import {Logo, BurgerIcon, ListIcon, ProfileIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {AppNavLink} from "../AppNavLink/AppNavLink";

const AppNav = () => {
    return (
        <nav className={styles.nav} aria-label="Навигация Stellar Burgers">
            <ul className={styles.list}>
                <li><AppNavLink to={'/'} icon={<BurgerIcon type="primary"/>} text={'Конструктор'} active={true}/></li>
                <li><AppNavLink to={'/'} icon={<ListIcon type="secondary"/>} text={'Лента заказов'}/></li>
            </ul>
            <Logo/>
            <ul className={`${styles.list} ${styles.listEnd}`}>
                <li><AppNavLink to={'/'} icon={<ProfileIcon type="secondary"/>} text={'Личный кабинет'}/></li>
            </ul>
        </nav>
    );
}

export {AppNav}
