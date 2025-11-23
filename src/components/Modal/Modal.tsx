import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from "react-dom";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useModal } from "../../context/ModalContext/ModalContext";
import { useNavigate, useLocation } from "react-router-dom";

import styles from './modal.module.css';

const Modal: FC = () => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const { renderModal, setRenderModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (location.pathname.startsWith('/ingredients/')) {
      const background = (location.state as any)?.background;
      backgroundPathRef.current = background?.pathname || '/';
    }
  }, [location]);

  const onCloseHandler = useCallback(() => {
    const isIngredientsRoute = location.pathname.startsWith('/ingredients/');

    setRenderModal({ render: false, children: null });

    if (isIngredientsRoute) {
      const background = (location.state as any)?.background;
      const targetPath = background?.pathname || '/';
      navigate(targetPath, { replace: true });
    }
  }, [setRenderModal, location, navigate]);

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
