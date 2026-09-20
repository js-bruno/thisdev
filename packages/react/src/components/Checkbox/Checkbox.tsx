import * as React from "react";
import { cx } from "../../utils/cx";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, className, type = "checkbox", ...props }, ref) {
    return (
      <label className={cx("aui-check", className)}>
        <input ref={ref} type={type} {...props} />
        {label != null && <span>{label}</span>}
      </label>
    );
  },
);
