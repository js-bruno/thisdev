import * as React from "react";
import { cx } from "../../utils/cx";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
}: TabsProps) {
  const [internal, setInternal] = React.useState(
    defaultValue ?? items[0]?.value,
  );
  const active = value ?? internal;
  const activeItem = items.find((item) => item.value === active);

  function select(next: string) {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }

  return (
    <div className={cx("aui-tabs", className)}>
      <div role="tablist" className="aui-tabs__list">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={`aui-tab-${item.value}`}
            aria-selected={active === item.value}
            aria-controls={`aui-panel-${item.value}`}
            disabled={item.disabled}
            className="aui-tab"
            onClick={() => select(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={`aui-panel-${activeItem.value}`}
          aria-labelledby={`aui-tab-${activeItem.value}`}
          className="aui-tabs__panel"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
