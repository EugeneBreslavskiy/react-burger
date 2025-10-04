import {FC} from "react";
import {BurgerIngredientsFilter} from "../BurgetIngredientsFilter/BurgerIngredientsFilter";
import {BurgerIngredientsList} from "../BurgerIngredientsList/BurgerIngredientsList";
import {CustomScrollBar} from "../CustomScrollBar/CustomScrollBar";
import {IngredientsSchema} from "../../types/ingredients";
import {groupIngredientsByType} from "../../utils/groupIngredientsByType";
import {FILTERS} from "../../utils/filters";

import styles from './burger-ingredients.module.css'


const BurgerIngredients: FC<IngredientsSchema> = ({ingredients}) => {
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
