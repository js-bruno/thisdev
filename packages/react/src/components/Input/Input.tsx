import * as React from "react";
import { cx } from "../../utils/cx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cx("aui-input", className)} {...props} />;
  },
);
