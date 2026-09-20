import * as React from "react";
import { cx } from "../../utils/cx";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, ...props }, ref) {
    return (
      <select ref={ref} className={cx("aui-select", className)} {...props} />
    );
  },
);
