import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from "react-dom";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useModal } from "../../context/ModalContext/ModalContext";
import { useLocation, useNavigate } from "react-router-dom";

import styles from './modal.module.css';

const Modal: FC = () => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const { renderModal, setRenderModal } = useModal();
  const location = useLocation();
  const navigate = useNavigate();
  const isIngredientsRouteRef = useRef(false);
  const backgroundPathRef = useRef<string | null>(null);

  // Отслеживаем изменения location для определения маршрута ингредиента
  useEffect(() => {
    // Проверяем реальный URL браузера, так как location.pathname может быть из background
    const realPathname = window.location.pathname;
    const wasIngredientsRoute = isIngredientsRouteRef.current;
    const isIngredientsRoute = realPathname.startsWith('/ingredients/');
    isIngredientsRouteRef.current = isIngredientsRoute;

    // Сохраняем background path для использования при закрытии
    if (isIngredientsRoute) {
      const background = (location.state as any)?.background;
      if (background?.pathname) {
        backgroundPathRef.current = background.pathname;
      } else {
        // Если background нет, используем location.pathname из React Router (это будет background location)
        backgroundPathRef.current = location.pathname || '/';
      }
    }

    // Если мы ушли с маршрута ингредиента, закрываем модальное окно
    if (wasIngredientsRoute && !isIngredientsRoute && renderModal?.render) {
      setRenderModal({ render: false, children: null });
    }
  }, [location.pathname, location.state, renderModal, setRenderModal]);

  const onCloseHandler = useCallback(() => {
    const realPathname = window.location.pathname;
    const isIngredientsRoute = realPathname.startsWith('/ingredients/');

    if (isIngredientsRoute) {
      const backgroundPath = backgroundPathRef.current || '/';

      navigate(backgroundPath, { replace: true });

      setRenderModal({ render: false, children: null });
    } else {
      setRenderModal({ render: false, children: null });
    }
  }, [setRenderModal, navigate, location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseHandler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseHandler]);

  useEffect(() => {
    const root = document.getElementById('modal-root');

    if (root && renderModal) {
      setRoot(root)
    }
  }, [renderModal]);

  const html =
    <div className={styles.modal}>
      <div className={styles.modalOverlay} onClick={onCloseHandler}></div>
      <div className={styles.modalContent}>
        <span className={styles.modalCloseIcon} onClick={onCloseHandler}>
          <CloseIcon type={'primary'} />
        </span>
        {renderModal?.children}
      </div>
    </div>

  return (
    renderModal?.render && root ? createPortal(html, root) : <></>
  )
};

export { Modal };
