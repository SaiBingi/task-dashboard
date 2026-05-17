import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode | ((onClose: () => void) => ReactNode);
}

const CLOSE_ANIMATION_DURATION = 220;

export default function Modal({ title, onClose, children }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  function requestClose() {
    if (isClosing) return;
    setIsClosing(true);
    window.setTimeout(onClose, CLOSE_ANIMATION_DURATION);
  }

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') requestClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const content = typeof children === 'function' ? children(requestClose) : children;

  return (
    <div
      className={`modal-overlay${isClosing ? ' modal-overlay--closing' : ''}`}
      onClick={requestClose}
    >
      <div
        className={`modal${isClosing ? ' modal--closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={requestClose}
          >
            ✕
          </button>
        </div>
        <div className="modal__body">
          {content}
        </div>
      </div>
    </div>
  );
}