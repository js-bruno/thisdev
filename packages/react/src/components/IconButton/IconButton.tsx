import * as React from "react";
import { cx } from "../../utils/cx";
import type { ButtonSize, ButtonVariant } from "../Button/Button";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  round?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      variant = "ghost",
      size = "md",
      round = true,
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
          "aui-btn--icon",
          variant !== "default" && `aui-btn--${variant}`,
          size !== "md" && `aui-btn--${size}`,
          round && "aui-btn--round",
          className,
        )}
        {...props}
      />
    );
  },
);
