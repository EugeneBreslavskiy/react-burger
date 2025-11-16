import React from 'react';
import { useParams } from 'react-router-dom';

export const IngredientPage = () => {
  const { id } = useParams();

  return (
    <main>
      <h1>Ингредиент</h1>
      <p>ID: {id}</p>
    </main>
  );
};


