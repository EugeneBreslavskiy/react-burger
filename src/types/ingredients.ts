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
