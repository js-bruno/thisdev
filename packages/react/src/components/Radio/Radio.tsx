import * as React from "react";
import { cx } from "../../utils/cx";

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio({ label, className, ...props }, ref) {
    return (
      <label className={cx("aui-check", className)}>
        <input ref={ref} type="radio" {...props} />
        {label != null && <span>{label}</span>}
      </label>
    );
  },
);
