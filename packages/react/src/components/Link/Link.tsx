import * as React from "react";
import { cx } from "../../utils/cx";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  subtle?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link({ subtle = false, className, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={cx("aui-link", subtle && "aui-link--subtle", className)}
        {...props}
      />
    );
  },
);
