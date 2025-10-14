import {FC, ReactNode, createContext, useState, useMemo, useContext} from "react";

interface IngredientIdSchema {
    ingredientId: string | undefined;
    setIngredientId: (id: string | undefined) => void;
}

const IngredientIdContext = createContext<IngredientIdSchema | undefined>(undefined);

interface IIngredientIdProvider {
    children: ReactNode;
}

const IngredientIdProvider: FC<IIngredientIdProvider> = ({ children }) => {
    const [ingredientId, setIngredientId] = useState<string | undefined>(undefined);

    const value = useMemo(() => ({ingredientId, setIngredientId}),[ingredientId])

    return (<IngredientIdContext.Provider value={value}>{children}</IngredientIdContext.Provider>)
}

const useIngredientId = () => {
    const context = useContext(IngredientIdContext);

    if (!context) {
        throw new Error('useIngredientId must be used within a IngredientIdProvider');
    }

    return context;
}

export {IngredientIdProvider, useIngredientId}
