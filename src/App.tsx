import React, {useEffect} from 'react';
import {Header} from "./components/Header/Header";
import {BurgerWorkspace} from "./components/BurgerWorkspace/BurgerWorkspace";
import {useDispatch, useSelector} from 'react-redux';
import {fetchIngredients} from './services/ingredientsSlice';
import type {AppDispatch, RootState} from './services/store';
import {ModalProvider} from "./context/ModalContext/ModalContext";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector((state: RootState) => state.ingredients.items);
    const loading = useSelector((state: RootState) => state.ingredients.loading);

    useEffect(() => {
        if (loading === 'idle') {
            dispatch(fetchIngredients());
        }
    }, [dispatch, loading]);

    return (
        <ModalProvider>
            <Header/>
            {Array.isArray(items) && items.length > 0 && <BurgerWorkspace ingredients={items}/>}
        </ModalProvider>
    );
}

export default App;
