import  {FC, useMemo} from 'react';
import {Counter} from "@ya.praktikum/react-developer-burger-ui-components";
import {IngredientSchema} from "../../types/ingredients";
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import type { RootState } from '../../services/store';

import styles from './burger-ingredient-item.module.css';
import {BurgerCredit} from "../BurgerCredit/BurgerCredit";

interface IBurgerIngredient {
    description: IngredientSchema;
}

const BurgerIngredient: FC<IBurgerIngredient> = ({description}) => {
    const {_id, name, image, price, type} = description;

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'INGREDIENT',
        item: description,
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }), [description]);

    const constructorState = useSelector((s: RootState) => s.burgerConstructor);

    const count = useMemo(() => {
        if (!constructorState) return 0;
        let c = 0;
        if (type === 'bun') {
            if (constructorState.bun && constructorState.bun._id === _id) c = 2;
        } else {
            c = constructorState.items.filter((it: any) => it._id === _id).length;
        }
        return c;
    }, [constructorState, _id, type]);

    return (
        <li ref={dragRef as any} className={styles.burgerIngredient} data-id={_id} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <img src={image} alt={name}/>
            <BurgerCredit amount={price}/>
            <span className={`text text_type_main-default ${styles.burgerIngredientName}`}>
                {name}
            </span>
            <Counter count={count}/>
        </li>
    );
};

export { BurgerIngredient };
