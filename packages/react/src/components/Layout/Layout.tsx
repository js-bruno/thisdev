import * as React from "react";
import { cx } from "../../utils/cx";

export type ContainerSize = "sm" | "md" | "lg" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export function Container({
  size = "md",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cx("aui-container", `aui-container--${size}`, className)}
      {...props}
    />
  );
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
}

export function Stack({ gap, className, style, ...props }: StackProps) {
  return (
    <div
      className={cx("aui-stack", className)}
      style={{ "--aui-stack-gap": gap, ...style } as React.CSSProperties}
      {...props}
    />
  );
}

export function Cluster({ gap, className, style, ...props }: StackProps) {
  return (
    <div
      className={cx("aui-cluster", className)}
      style={{ "--aui-stack-gap": gap, ...style } as React.CSSProperties}
      {...props}
    />
  );
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  min?: string;
}

export function Grid({ gap, min, className, style, ...props }: GridProps) {
  return (
    <div
      className={cx("aui-grid", className)}
      style={
        {
          "--aui-stack-gap": gap,
          "--aui-grid-min": min,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
