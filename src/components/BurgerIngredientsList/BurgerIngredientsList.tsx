import { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import { GroupedIngredients } from "../../types/ingredients";
import { BurgerIngredient } from "../BurgerIngredient/BurgerIngredient";
import { useAppDispatch } from '../../hooks/redux';
import { setIngredientId } from "../../services/ingredientIdSlice";
import { useLocation, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import styles from './burger-ingredients-list.module.css';

interface IBurgerIngredientsList {
  ingredients: GroupedIngredients[];
  onTabChange: (tab: string) => void;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}

interface SectionObserverSchema {
  title: string;
  onInView: (title: string) => void;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  scrollContainer: HTMLElement | null;
  children: React.ReactNode;
}

const SectionObserver: FC<SectionObserverSchema> = ({ title, onInView, sectionRefs, scrollContainer, children }) => {
  const { ref, inView } = useInView({
    threshold: 0,
    root: scrollContainer,
    rootMargin: '-100px 0px -60% 0px',
  });

  useEffect(() => {
    if (inView) {
      onInView(title);
    }
  }, [inView, title, onInView]);

  const setRef = (node: HTMLElement | null) => {
    sectionRefs.current[title] = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && 'current' in ref) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return (
    <li ref={setRef} className={styles.burgerIngredientsListItem}>
      {children}
    </li>
  );
};

const BurgerIngredientsList: FC<IBurgerIngredientsList> = ({ ingredients, onTabChange, sectionRefs }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const listRef = useRef<HTMLUListElement | null>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Находим скролл контейнер (viewport) через родительский элемент
    if (listRef.current) {
      const viewport = listRef.current.closest('[class*="customScrollBarViewPort"]') as HTMLElement;
      if (viewport) {
        setScrollContainer(viewport);
      }
    }
  }, []);

  const onClickHandler = (e: SyntheticEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement | null;

    const id = target?.closest('[data-id]')?.getAttribute('data-id') as string | null;

    if (id) {
      dispatch(setIngredientId(id));
      navigate(`/ingredients/${id}`, { state: { background: location }, replace: false });
    }
  }

  return (
    <ul className={styles.burgerIngredientsList} ref={listRef} onClick={onClickHandler}>
      {ingredients.map(({ title, items }) => (
        <SectionObserver
          key={title}
          title={title}
          onInView={onTabChange}
          sectionRefs={sectionRefs}
          scrollContainer={scrollContainer}
        >
          <h2 className={'text text_type_main-medium'}>
            {title}
          </h2>
          <ul className={styles.burgerIngredientsListItems}>
            {items.map((item) => <BurgerIngredient key={item._id} description={item} />)}
          </ul>
        </SectionObserver>
      ))}
    </ul>
  )
}

export { BurgerIngredientsList };
