import * as React from "react";
import { cx } from "../../utils/cx";

export type ButtonVariant =
  | "default"
  | "primary"
  | "accent"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  round?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "default",
      size = "md",
      block = false,
      round = false,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cx(
          "aui-btn",
          variant !== "default" && `aui-btn--${variant}`,
          size !== "md" && `aui-btn--${size}`,
          block && "aui-btn--block",
          round && "aui-btn--round",
          className,
        )}
        {...props}
      />
    );
  },
);
