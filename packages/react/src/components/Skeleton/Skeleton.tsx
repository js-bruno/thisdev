import * as React from "react";
import { cx } from "../../utils/cx";

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: string | number;
  height?: string | number;
  radius?: string;
  circle?: boolean;
}

export function Skeleton({
  width,
  height,
  radius,
  circle = false,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx("aui-skeleton", className)}
      style={{
        display: "block",
        width,
        height,
        borderRadius: circle ? "50%" : radius,
        ...style,
      }}
      {...props}
    />
  );
}
