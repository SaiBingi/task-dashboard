import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog__icon">⚠</div>

        <div className="confirm-dialog__content">
          <h3 className="confirm-dialog__title">{title}</h3>
          <p className="confirm-dialog__message">{message}</p>
        </div>

        <div className="confirm-dialog__actions">
          <button className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
