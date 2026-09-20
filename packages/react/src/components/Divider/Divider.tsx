import * as React from "react";
import { cx } from "../../utils/cx";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  vertical?: boolean;
}

export function Divider({ vertical = false, className, ...props }: DividerProps) {
  return (
    <hr
      className={cx(
        "aui-divider",
        vertical && "aui-divider--vertical",
        className,
      )}
      {...props}
    />
  );
}
