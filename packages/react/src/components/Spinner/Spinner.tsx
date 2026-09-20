import * as React from "react";
import { cx } from "../../utils/cx";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

export function Spinner({
  size = "md",
  label = "Carregando",
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(
        "aui-spinner",
        size !== "md" && `aui-spinner--${size}`,
        className,
      )}
      {...props}
    />
  );
}
