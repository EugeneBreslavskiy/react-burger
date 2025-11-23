import { FC, useState, useRef, useCallback } from "react";
import { BurgerIngredientsFilter } from "../BurgetIngredientsFilter/BurgerIngredientsFilter";
import { BurgerIngredientsList } from "../BurgerIngredientsList/BurgerIngredientsList";
import { CustomScrollBar } from "../CustomScrollBar/CustomScrollBar";
import { groupIngredientsByType } from "../../utils/groupIngredientsByType";
import { FILTERS } from "../../utils/filters";
import { useSelector } from 'react-redux';
import type { RootState } from '../../services/store';

import styles from './burger-ingredients.module.css'


const BurgerIngredients: FC = () => {
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const [currentTab, setCurrentTab] = useState(FILTERS[0]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  const handleTabClick = useCallback((tab: string) => {
    setCurrentTab(tab);
    const sectionElement = sectionRefs.current[tab];
    const scrollContainer = scrollContainerRef.current?.querySelector('[class*="customScrollBarViewPort"]') as HTMLElement;

    if (sectionElement && scrollContainer) {
      isScrollingRef.current = true;
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = sectionElement.getBoundingClientRect();
      const scrollOffset = scrollContainer.scrollTop + elementRect.top - containerRect.top - 20;
      scrollContainer.scrollTo({
        top: Math.max(0, scrollOffset),
        behavior: 'smooth'
      });
      
      // Сбрасываем флаг после завершения скролла
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  }, []);

  const handleSectionInView = useCallback((tab: string) => {
    // Обновляем таб только если скролл не был инициирован кликом на таб
    if (!isScrollingRef.current) {
      setCurrentTab(tab);
    }
  }, []);

  return (
    <div className={styles.burgerIngredients} ref={scrollContainerRef}>
      <BurgerIngredientsFilter filters={FILTERS} current={currentTab} onTabChange={handleTabClick} />
      <CustomScrollBar height={664}>
        <BurgerIngredientsList
          ingredients={groupIngredientsByType(ingredients)}
          onTabChange={handleSectionInView}
          sectionRefs={sectionRefs}
        />
      </CustomScrollBar>
    </div>
  )
}

export { BurgerIngredients }
