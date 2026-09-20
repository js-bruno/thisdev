import * as React from "react";
import { cx } from "../../utils/cx";

export type BadgeTone =
  | "default"
  | "accent"
  | "accent2"
  | "ok"
  | "warn"
  | "danger";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "aui-badge",
        tone !== "default" && `aui-badge--${tone}`,
        className,
      )}
      {...props}
    />
  );
}
