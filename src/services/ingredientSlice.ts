import {createSlice} from '@reduxjs/toolkit';

interface IngredientsStateSchema {}

const initialState: IngredientsStateSchema = {};

const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {},
});

const {reducer} = ingredientsSlice;

export {reducer as ingredientsReducer};
export {initialState};