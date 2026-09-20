import * as React from "react";
import { cx } from "../../utils/cx";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch({ label, className, ...props }, ref) {
    return (
      <label className={cx("aui-switch", className)}>
        <input ref={ref} type="checkbox" role="switch" {...props} />
        {label != null && <span>{label}</span>}
      </label>
    );
  },
);
