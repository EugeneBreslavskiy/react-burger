import {FC} from "react";
import { IngredientsSchema} from "../../types/ingredients";
import {Title} from "../Title/Title";
import {Container} from "../Container/Container";
import {BurgerIngredients} from "../BurgerIngredients/BurgerIngredients";
import {BurgerConstructor} from "../BurgerConstructor/BurgerConstructor";

import styles from "./burger-constructor.module.css";

const BurgerWorkspace: FC<IngredientsSchema> = ({ingredients}) => {
    return (
        <section className={styles.burgerWorkspaceSection}>
            <Container>
                <Title>Соберите бургер</Title>
                <div className={styles.burgerWorkspace}>
                    <BurgerIngredients ingredients={ingredients}/>
                    <BurgerConstructor ingredients={ingredients}/>
                </div>
            </Container>
        </section>
    )
};

export { BurgerWorkspace };
