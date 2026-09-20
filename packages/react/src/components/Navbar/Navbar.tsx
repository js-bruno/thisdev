import * as React from "react";
import { cx } from "../../utils/cx";

export interface NavbarLink {
  label: React.ReactNode;
  href: string;
  current?: boolean;
}

export interface NavbarProps {
  brand?: React.ReactNode;
  links?: NavbarLink[];
  actions?: React.ReactNode;
  className?: string;
}

export function Navbar({ brand, links, actions, className }: NavbarProps) {
  return (
    <nav className={cx("aui-navbar", className)}>
      {brand != null && <span className="aui-navbar__brand">{brand}</span>}
      {links != null && (
        <div className="aui-navbar__nav">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="aui-navbar__link"
              aria-current={link.current ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      {actions}
    </nav>
  );
}
