import {FC, ReactNode} from "react";

import styles from './container.module.css';

interface IContainer {
    children: ReactNode;
}

const Container: FC<IContainer> = ({ children }) => {
    return (<div className={styles.container}>{children}</div>);
}

export {Container};
