import * as React from "react";
import { cx } from "../../utils/cx";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  htmlFor?: string;
  help?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  invalid?: boolean;
}

export function Field({
  label,
  htmlFor,
  help,
  error,
  required = false,
  invalid = false,
  className,
  children,
  ...props
}: FieldProps) {
  const isInvalid = invalid || error != null;

  return (
    <div
      className={cx("aui-field", isInvalid && "aui-field--invalid", className)}
      {...props}
    >
      {label != null && (
        <label className="aui-field__label" htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="aui-field__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error != null ? (
        <span className="aui-field__error">{error}</span>
      ) : (
        help != null && <span className="aui-field__help">{help}</span>
      )}
    </div>
  );
}
