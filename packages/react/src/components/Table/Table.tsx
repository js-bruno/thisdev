import * as React from "react";
import { cx } from "../../utils/cx";

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  head?: React.ReactNode[];
  rows?: React.ReactNode[][];
  caption?: React.ReactNode;
  striped?: boolean;
}

export function Table({
  head,
  rows,
  caption,
  striped = false,
  className,
  children,
  ...props
}: TableProps) {
  return (
    <div className="aui-table-wrap">
      <table
        className={cx("aui-table", striped && "aui-table--striped", className)}
        {...props}
      >
        {caption != null && <caption>{caption}</caption>}
        {head != null && (
          <thead>
            <tr>
              {head.map((cell, index) => (
                <th key={index} scope="col">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {rows != null && (
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
        {children}
      </table>
    </div>
  );
}
