import {FC} from "react";
import {Nav} from "../Nav/Nav";
import {Container} from "../Container/Container";

import styles from './header.module.css'


const Header: FC = () => {
    return (
        <header className={styles.header}>
            <Container>
                <Nav/>
            </Container>
        </header>
    )
}

export {Header}
