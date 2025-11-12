import React from "react";
import "./fileViewer.css";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
};

const Modal: React.FC<Props> = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <div className="viewer-title">{title}</div>
          <button
            className="viewer-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="viewer-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
