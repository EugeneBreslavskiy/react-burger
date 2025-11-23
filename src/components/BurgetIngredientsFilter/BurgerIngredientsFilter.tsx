import { FC } from "react";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";

import styles from './burger-ingredients-filter.module.css';

interface IBurgerIngredientsFilter {
  filters: string[];
  current: string;
  onTabChange: (tab: string) => void;
}

const BurgerIngredientsFilter: FC<IBurgerIngredientsFilter> = ({ filters, current, onTabChange }) => {
  return (
    <div className={styles.burgerIngredientsFilter}>
      {filters.map((filter) => <Tab key={filter} value={filter} active={current === filter} onClick={onTabChange}>{filter}</Tab>)}
    </div>
  )
}

export { BurgerIngredientsFilter }
