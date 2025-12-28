import { FC } from 'react';
import { Counter } from "@ya.praktikum/react-developer-burger-ui-components";
import { IngredientSchema } from "../../types/ingredients";
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import type { RootState } from '../../services/store';

import styles from './burger-ingredient-item.module.css';
import { BurgerCredit } from "../BurgerCredit/BurgerCredit";

interface IBurgerIngredient {
  description: IngredientSchema;
}

const BurgerIngredient: FC<IBurgerIngredient> = ({ description }) => {
  const { _id, name, image, price, type } = description;

  const constructorState = useSelector((state: RootState) => state.burgerConstructor);
  const count = (() => {
    if (type === 'bun') {
      return constructorState.bun && constructorState.bun._id === _id ? 2 : 0;
    }
    if (Array.isArray(constructorState.items)) {
      return constructorState.items.filter(i => i._id === _id).length;
    }
    return 0;
  })();

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'INGREDIENT',
    item: description,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [description]);

  return (
    <li ref={dragRef} className={styles.burgerIngredient} data-id={_id} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img src={image} alt={name} />
      <BurgerCredit amount={price} />
      <span className={`text text_type_main-default ${styles.burgerIngredientName}`}>
        {name}
      </span>
      {count > 0 && <Counter count={count} />}
    </li>
  );
};

export { BurgerIngredient };
