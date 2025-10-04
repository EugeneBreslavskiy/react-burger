import React from 'react';
import './App.css';
import {Header} from "./components/Header/Header";
import {BurgerWorkspace} from "./components/BurgerWorkspace/BurgerWorkspace";
import {data} from './utils/data'

function App() {
    return (
        <>
            <Header/>
            <BurgerWorkspace ingredients={data}/>
        </>
    );
}

export default App;
