import * as React from "react"
import type Handsontable from 'handsontable';
import { cn } from "@/lib/utils"

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>;
  height?: number;
  readOnly?: boolean;
  className?: string;
}

const Row = React.forwardRef<
  HTMLDivElement,
  RowProps
>(({ 
  className,
  data,
  height,
  readOnly = false,
  ...props 
}, ref) => {
  const rowSettings: Partial<Handsontable.CellProperties> = {
    height,
    readOnly
  };

  return (
    <div
      ref={ref}
      className={cn("hot-row", className)}
      data-row-settings={JSON.stringify(rowSettings)}
      data-row-data={JSON.stringify(data)}
      {...props}
    />
  );
});

Row.displayName = "Row";

export { Row };