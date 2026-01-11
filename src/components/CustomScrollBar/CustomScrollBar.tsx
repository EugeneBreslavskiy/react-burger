import { FC, ReactNode, useRef } from "react";

import styles from './custom-scroll-bar.module.css';

interface ICustomScrollBar {
  height: number;
  children: ReactNode;
}

const CustomScrollBar: FC<ICustomScrollBar> = ({ height, children }) => {
  const containerRef = useRef(null);

  return (
    <div className={styles.customScrollBarContainer} style={{ height: `${height}px` }} ref={containerRef}>
      <div className={styles.customScrollBarViewPort}>
        {children}
      </div>
    </div>
  )
}

export { CustomScrollBar }
