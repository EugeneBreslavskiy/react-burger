export interface IngredientSchema {
    _id: string,
    name: string,
    type: 'bun' | 'main' | 'sauce',
    proteins: number,
    fat :number,
    carbohydrates: number,
    calories: number,
    price: number,
    image: string,
    image_mobile: string,
    image_large: string,
    __v: number,
}

export interface IngredientsSchema {
    ingredients: IngredientSchema[];
}

export const typeTitles: Record<string, string> = {
    bun: "Булки",
    main: "Начинки",
    sauce: "Соусы"
};

export type GroupedIngredients = {
    title: string;
    items: IngredientSchema[];
};

export type NutrientName = 'Калории,ккал' | 'Белки, г' | 'Жиры, г' | 'Углеводы, г';

export interface IngredientNutrientSchema {
    name: NutrientName;
    value: number
}

export interface IngredientDetailsSchema extends Pick<IngredientSchema, 'image_large' | 'name'> {
    nutrients: IngredientNutrientSchema[];
}

export interface OrderDetailsSchema {
    id: string | undefined;
}
