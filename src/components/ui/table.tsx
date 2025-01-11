import * as React from "react"
import { HotTable, HotTableRef, HotTableProps } from '@handsontable/react-wrapper';
import { cn } from "@/lib/utils"
import { CellChange, ChangeSource } from 'handsontable/common';

export interface TableProps extends HotTableProps {
  children?: React.ReactNode;
  data?: Array<Record<string, any>>;
  columns?: Array<Record<string, any>>;
  height?: number;
  width?: number;
  readOnly?: boolean;
  licenseKey?: string;
  className?: string;
  onCellChange?: (changes: CellChange[] | null, source: ChangeSource) => void;
}

const Table = React.forwardRef<
  HotTableRef,
  TableProps
>(({ 
  className,
  children,
  data = [],
  height = 400,
  width = '100%',
  readOnly = false,
  licenseKey = 'non-commercial-and-evaluation',
  onCellChange,
  columns,
  ...props 
}, ref) => {
  const derivedColumns = React.Children.toArray(children)
    .filter((child): child is React.ReactElement => 
      React.isValidElement(child) && 
      typeof child.type === 'function' && 
      'displayName' in child.type && 
      child.type.displayName === 'Column'
    )
    .map((child) => child.props);
    
  /**
    // Satır verilerini children'dan toplama
  const rowData = React.Children.toArray(children)
  .filter((child): child is React.ReactElement => 
    React.isValidElement(child) && 
    typeof child.type === 'function' && 
    'displayName' in child.type && 
    child.type.displayName === 'Row'
  )
  .map((child) => JSON.parse(child.props['data-row-data']));

  const tableData = data.length > 0 ? data : rowData;

  */ 

  const finalColumns = columns || derivedColumns;

  return (
    <HotTable
      ref={ref}
      data={data}
      columns={finalColumns}
      height={height}
      width={width}
      readOnly={readOnly}
      licenseKey={licenseKey}
      afterChange={onCellChange}
      className={cn("hot-table-container htCenter", className)}
      {...props}
    />
  );
});

Table.displayName = "Table";

export { Table };