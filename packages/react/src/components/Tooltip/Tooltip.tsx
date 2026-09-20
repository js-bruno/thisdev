import * as React from "react";
import { cx } from "../../utils/cx";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cx("aui-tooltip", className)} tabIndex={0}>
      {children}
      <span role="tooltip" className="aui-tooltip__content">
        {content}
      </span>
    </span>
  );
}
