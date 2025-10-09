import React, {useEffect, useState} from 'react';
import {IngredientIdProvider} from "./context/IngredientIdContext/IngredientIdContext";
import {Header} from "./components/Header/Header";
import {BurgerWorkspace} from "./components/BurgerWorkspace/BurgerWorkspace";
import {HttpClient} from "./utils/httpClient";
import {API_URL} from "./utils/api";
import {IngredientSchema} from "./types/ingredients";
import {ModalProvider} from "./context/ModalContext/ModalContext";
import {OrderProvider} from "./context/OrderContext/OrderContext";

const httpClient = new HttpClient({baseUrl: API_URL});

function App() {
    const [data, setData] = useState<IngredientSchema[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ingredients = await httpClient.get<IngredientSchema[]>('ingredients');
                setData(ingredients);
            } catch (error) {
                console.error('Failed to fetch ingredients:', error);
                setData([]);
            }
        };

        fetchData();
    }, []);

    return (
        <IngredientIdProvider>
            <OrderProvider>
                <ModalProvider>
                    <Header/>
                    {Array.isArray(data) && data?.length > 0 && <BurgerWorkspace ingredients={data}/>}
                </ModalProvider>
            </OrderProvider>
        </IngredientIdProvider>
    );
}

export default App;
