import styles from './header.module.css'
import {AppNav} from "../AppNav/AppNav";

const AppHeader = () => {
    return (
        <header className={styles.header}>
            <AppNav/>
        </header>
    )
}

export {AppHeader}
