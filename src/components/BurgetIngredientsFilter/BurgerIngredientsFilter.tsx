import {FC, useState} from "react";
import {Tab} from "@ya.praktikum/react-developer-burger-ui-components";

interface IBurgerIngredientsFilter {
    filters: string[];
}

const BurgerIngredientsFilter: FC<IBurgerIngredientsFilter> = ({ filters }) => {
    const [current, setCurrent] = useState(filters[0]);

    return (
        <div style={{display: 'flex'}}>
            {filters.map((filter) => <Tab key={filter} value={filter} active={current === filter} onClick={setCurrent}>{filter}</Tab>)}
        </div>
    )
}

export {BurgerIngredientsFilter}
