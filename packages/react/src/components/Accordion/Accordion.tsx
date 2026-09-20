import * as React from "react";
import { cx } from "../../utils/cx";

export interface AccordionItem {
  title: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  className,
}: AccordionProps) {
  return (
    <div className={cx("aui-accordion", className)}>
      {items.map((item, index) => (
        <details
          key={index}
          className="aui-accordion__item"
          name={allowMultiple ? undefined : "aui-accordion"}
          open={item.open}
        >
          <summary className="aui-accordion__summary">{item.title}</summary>
          <div className="aui-accordion__content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
