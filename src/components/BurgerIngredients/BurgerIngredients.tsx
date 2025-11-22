import {FC} from "react";
import {BurgerIngredientsFilter} from "../BurgetIngredientsFilter/BurgerIngredientsFilter";
import {BurgerIngredientsList} from "../BurgerIngredientsList/BurgerIngredientsList";
import {CustomScrollBar} from "../CustomScrollBar/CustomScrollBar";
import {groupIngredientsByType} from "../../utils/groupIngredientsByType";
import {FILTERS} from "../../utils/filters";
import {useSelector} from 'react-redux';
import type {RootState} from '../../services/store';

import styles from './burger-ingredients.module.css'


const BurgerIngredients: FC = () => {
    const ingredients = useSelector((state: RootState) => state.ingredients.items);

    return (
        <div className={styles.burgerIngredients}>
            <BurgerIngredientsFilter filters={FILTERS} />
            <CustomScrollBar height={664}>
                <BurgerIngredientsList ingredients={groupIngredientsByType(ingredients)}/>
            </CustomScrollBar>
        </div>
    )
}

export {BurgerIngredients}
