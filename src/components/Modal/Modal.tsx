import React, { FC, useEffect, useState, useCallback } from 'react';
import { createPortal } from "react-dom";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useModal } from "../../context/ModalContext/ModalContext";

import styles from './modal.module.css';

const Modal: FC = () => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const { renderModal, setRenderModal } = useModal();

  const onCloseHandler = useCallback(() => {
    // Если есть кастомный обработчик закрытия, вызываем его
    if (renderModal?.onClose) {
      renderModal.onClose();
    }

    // Закрываем модальное окно
    setRenderModal({ render: false, children: null, onClose: undefined });
  }, [setRenderModal, renderModal]);

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
