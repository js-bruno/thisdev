import * as React from "react";
import { cx } from "../../utils/cx";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  square?: boolean;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  square = false,
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      className={cx(
        "aui-avatar",
        size !== "md" && `aui-avatar--${size}`,
        square && "aui-avatar--square",
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt ?? name ?? ""} />
      ) : (
        <span aria-hidden={name ? "true" : undefined}>
          {name ? initials(name) : "?"}
        </span>
      )}
    </span>
  );
}
