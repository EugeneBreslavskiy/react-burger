import { useParams } from 'react-router-dom';
import { PageSection } from '../components/PageSection/PageSection';

export const IngredientPage = () => {
  const { id } = useParams();

  return (
    <PageSection>
      <h1>Ингредиент</h1>
      <p>ID: {id}</p>
    </PageSection>
  );
};


