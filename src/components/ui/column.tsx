import * as React from "react"
import Handsontable from 'handsontable/base';
import { cn } from "@/lib/utils"
import { HotColumnProps, HotColumn } from '@handsontable/react-wrapper';

interface ColumnProps extends HotColumnProps {
  className?: string;
  data: string;
  title?: string;
  type?: Handsontable.CellType;
  width?: number;
  readOnly?: boolean;
  validator?: (value: any, callback: (valid: boolean) => void) => void;
  source?: any[];
}

const Column = React.forwardRef<
  typeof HotColumn,
  ColumnProps
>(({ 
  className,
  data,
  title,
  type = 'text',
  width,
  readOnly = false,
  validator,
  source,
  ...props 
}, ref) => {
  const columnSettings: Handsontable.ColumnSettings = {
    data,
    type,
    title: title || data,
    width,
    readOnly,
    validator,
    source
  };

  return (
    <HotColumn
      ref={ref}
      className={cn("hot-column", className)}
      settings={columnSettings}
      {...props}
    />
  );
});

Column.displayName = "Column";

export { Column, type ColumnProps };