import * as React from "react";
import { cx } from "../../utils/cx";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  label?: string;
}

export function Progress({
  value = 0,
  max = 100,
  indeterminate = false,
  label,
  className,
  ...props
}: ProgressProps) {
  const pct = Math.round((value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : max}
      aria-valuenow={indeterminate ? undefined : value}
      className={cx(
        "aui-progress",
        indeterminate && "aui-progress--indeterminate",
        className,
      )}
      {...props}
    >
      <div
        className="aui-progress__bar"
        style={indeterminate ? undefined : { width: `${pct}%` }}
      />
    </div>
  );
}
