import * as React from "react";
import { cx } from "../../utils/cx";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Tag({ className, ...props }: TagProps) {
  return <span className={cx("aui-tag", className)} {...props} />;
}
