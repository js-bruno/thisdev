import * as React from "react";
import { cx } from "../../utils/cx";
import { IconButton } from "../IconButton/IconButton";

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx("aui-dialog", className)}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClose={() => onClose?.()}
    >
      <div className="aui-dialog__header">
        {title != null ? <h2 className="aui-dialog__title">{title}</h2> : <span />}
        <IconButton aria-label="Fechar" size="sm" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M6 6l12 12M18 6 6 18"
            />
          </svg>
        </IconButton>
      </div>
      <div className="aui-dialog__body">{children}</div>
      {footer != null && <div className="aui-dialog__footer">{footer}</div>}
    </dialog>
  );
}
