import {GroupedIngredients, IngredientSchema, typeTitles} from "../types/ingredients";
import {FILTERS} from "./filters";
import { data } from "./data";

export function groupIngredientsByType(items: IngredientSchema[]): GroupedIngredients[] {
    const grouped = items.reduce<Record<string, IngredientSchema[]>>((acc, item) => {
        if (!acc[item.type]) {
            acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
    }, {});

    return FILTERS.map((filter) => {
        const type = Object.keys(typeTitles).find(key => typeTitles[key] === filter);
        return {
            title: filter,
            items: type ? grouped[type] ?? [] : []
        };
    });
}

const grouped = groupIngredientsByType(data);
console.log(grouped);
