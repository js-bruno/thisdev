import * as React from "react";
import { cx } from "../../utils/cx";

export type CalloutTone = "info" | "ok" | "warn" | "danger" | "accent";

export interface CalloutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: CalloutTone;
  title?: React.ReactNode;
  icon?: React.ReactNode;
}

const defaultIcon: Record<CalloutTone, string> = {
  info: "i",
  ok: "✓",
  warn: "!",
  danger: "×",
  accent: "★",
};

export function Callout({
  tone = "info",
  title,
  icon,
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <div
      role={tone === "danger" || tone === "warn" ? "alert" : "note"}
      className={cx(
        "aui-callout",
        tone !== "info" && `aui-callout--${tone}`,
        className,
      )}
      {...props}
    >
      <span className="aui-callout__icon" aria-hidden="true">
        {icon ?? defaultIcon[tone]}
      </span>
      <div>
        {title != null && <p className="aui-callout__title">{title}</p>}
        <div className="aui-callout__body">{children}</div>
      </div>
    </div>
  );
}
