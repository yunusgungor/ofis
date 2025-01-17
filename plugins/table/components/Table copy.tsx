import React from 'react';
import { forwardRef, useEffect, useState } from 'react';
import { HotTable, HotTableRef } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { invoke } from '@tauri-apps/api/core';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

registerAllModules();

interface TableData {
  [key: string]: any;
}

interface TableProps {
  data?: TableData[];
  tableName?: string;
  columns?: Array<{
    data: string;
    title: string;
    type?: 'text' | 'numeric' | 'date' | 'checkbox' | 'dropdown';
    source?: string[];
    readOnly?: boolean;
  }>;
  children?: React.ReactNode;
  readOnly?: boolean;
  width?: number | string;
  height?: number;
  onDataChange?: (changes: any[] | null) => void;
}

export const Table = forwardRef<HotTableRef, TableProps>(({
  data: initialData,
  tableName,
  columns: initialColumns,
  children,
  readOnly = false,
  width = '100%',
  height = 500,
  onDataChange,
  ...props
}, ref) => {
  const [data, setData] = useState<TableData[]>(initialData || []);
  const [loading, setLoading] = useState(!!tableName);

  // Children'dan sütunları al
  const childColumns = React.Children.toArray(children)
    .filter((child): child is React.ReactElement => 
      React.isValidElement(child) && 
      typeof child.type === 'function' && 
      'displayName' in child.type && 
      child.type.displayName === 'Column'
    )
    .map((child) => child.props);

  const columns = initialColumns || childColumns;

  const finalColumns = columns.map(column => ({
    ...column,
    width: 150,
    title: column.title,
    wordWrap: true
  }));

  useEffect(() => {
    if (tableName) {
      fetchData();
    } else if (initialData) {
      setData(initialData);
    }
  }, [tableName, initialData]);

  const fetchData = async () => {
    if (!tableName) return;
    
    try {
      setLoading(true);
      const result = await invoke<TableData[]>('fetch_table_data', { tableName });
      setData(result);
    } catch (error) {
      console.error(`Veri yüklenirken hata oluştu: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAfterChange = async (changes: any[] | null) => {
    if (!changes) return;

    if (onDataChange) {
      onDataChange(changes);
    }

    if (tableName) {
      try {
        const updates = changes.map(([row, prop, oldValue, newValue]) => ({
          id: data[row].id,
          field: prop,
          value: newValue
        }));

        await invoke('update_table_data', { tableName, updates });
        await fetchData();
      } catch (error) {
        console.error(`Veri güncellenirken hata oluştu: ${error}`);
      }
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <HotTable
      ref={ref}
      data={data}
      columns={finalColumns}
      width={width}
      height={height}
      rowHeaders={true}
      colHeaders={true}
      filters={true}
      dropdownMenu={true}
      contextMenu={true}
      multiColumnSorting={true}
      manualColumnResize={true}
      manualRowResize={true}
      readOnly={readOnly}
      licenseKey="non-commercial-and-evaluation"
      afterChange={handleAfterChange}
      className="htCenter"
      {...props}
    />
  );
});

Table.displayName = 'Table';
