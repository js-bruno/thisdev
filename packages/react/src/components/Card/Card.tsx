import * as React from "react";
import { cx } from "../../utils/cx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  media?: string;
  actions?: React.ReactNode;
  interactive?: boolean;
  flush?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    title,
    subtitle,
    media,
    actions,
    interactive = false,
    flush = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const hasHeader = title != null || subtitle != null || actions != null;

  return (
    <div
      ref={ref}
      className={cx(
        "aui-card",
        interactive && "aui-card--interactive",
        flush && "aui-card--flush",
        className,
      )}
      {...props}
    >
      {media && <img className="aui-card__media" src={media} alt="" />}
      {hasHeader && flush && (
        <div className="aui-card__header">
          {title != null && <h3 className="aui-card__title">{title}</h3>}
          {actions}
        </div>
      )}
      {hasHeader && !flush && (
        <div className="aui-card__header">
          <div>
            {title != null && <h3 className="aui-card__title">{title}</h3>}
            {subtitle != null && (
              <p className="aui-card__subtitle">{subtitle}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div className="aui-card__body">{children}</div>
    </div>
  );
});
