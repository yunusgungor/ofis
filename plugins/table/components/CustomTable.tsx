import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HotTable, HotTableClass, HotTableProps } from '@handsontable/react';
import Handsontable from 'handsontable';
import { cn } from "@/lib/utils";

import { HotRow, type HotRowProps, type RowSettings } from './HotRow';
import HotColumn, { type HotColumnProps } from './HotColumn';

interface TableData<T = any> {
  [key: string]: T;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData: TableData[];
}

interface CustomTableProps<T = any> extends Omit<HotTableProps, 'data'> {
  data?: T[];
  width?: number | string;
  height?: number | string;
  className?: string;
  readOnly?: boolean;
  rowHeaders?: boolean;
  colHeaders?: boolean;
  minRows?: number;
  minCols?: number;
  minSpareRows?: number;
  minSpareCols?: number;
  autoWrapRow?: boolean;
  autoWrapCol?: boolean;
  licenseKey?: string;
  settings?: Handsontable.GridSettings;
  children?: React.ReactNode;
  onCellChange?: (changes: Handsontable.CellChange[] | null) => void;
  onAfterValidate?: (isValid: boolean, value: any, row: number, prop: string) => void;
  onError?: (error: Error) => void;
  onBeforeRowMove?: (rows: number[], target: number) => void;
  onAfterRowMove?: (rows: number[], target: number) => void;
  onBeforeColumnMove?: (columns: number[], target: number) => void;
  onAfterColumnMove?: (columns: number[], target: number) => void;
  onExport?: () => void;
}

interface CustomTableState {
  loadingState: 'idle' | 'loading' | 'error' | 'success';
  error: Error | null;
  columnSettings: Map<number, Handsontable.ColumnSettings>;
  rowSettings: Map<number, Handsontable.CellProperties & RowSettings>;
}

const calculateColumnWidths = useCallback((data: any[]) => {
  if (!data.length) return [];
  
  const headers = Object.keys(data[0]);
  return headers.map(header => {
    const maxContentLength = Math.max(
      header.length,
      ...data.map(row => String(row[header]).length)
    );
    return Math.min(Math.max(maxContentLength * 8, 50), 300);
  });
}, []);

const CustomTable = forwardRef<HotTableClass, CustomTableProps>((props, ref) => {
  const {
    data = [],
    width = '100%',
    height = 400,
    className,
    readOnly = false,
    rowHeaders = true,
    colHeaders = true,
    minRows = 0,
    minCols = 0,
    minSpareRows = 0,
    minSpareCols = 0,
    autoWrapRow = true,
    autoWrapCol = true,
    licenseKey = 'non-commercial-and-evaluation',
    settings = {},
    children,
    onCellChange,
    onAfterValidate,
    onError,
    onBeforeRowMove,
    onAfterRowMove,
    onBeforeColumnMove,
    onAfterColumnMove,
    onExport,
  } = props;

  const hotRef = useRef<HotTableClass | null>(null);
  const [state, setState] = useState<CustomTableState>({
    loadingState: 'idle',
    error: null,
    columnSettings: new Map(),
    rowSettings: new Map()
  });

  const { loadingState, error, columnSettings, rowSettings } = state;

  const handleColumnSettings = useCallback((settings: Handsontable.ColumnSettings, index: number) => {
    setState(prev => ({
      ...prev,
      columnSettings: new Map(prev.columnSettings).set(index, settings)
    }));
  }, []);

  const handleRowSettings = useCallback((settings: Handsontable.CellProperties & RowSettings, index: number) => {
    setState(prev => ({
      ...prev,
      rowSettings: new Map(prev.rowSettings).set(index, settings)
    }));
  }, []);

  const columnSettingsCache = useMemo(() => {
    const cache = new Map<number, Handsontable.ColumnSettings>();
    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement(child) && child.type === HotColumn) {
        cache.set(index, columnSettings.get(index) || {});
      }
    });
    return cache;
  }, [children, columnSettings]);

  const columns = useMemo(() => {
    const cols: Handsontable.ColumnSettings[] = [];
    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement(child) && child.type === HotColumn) {
        const colSettings = columnSettingsCache.get(index) || {};
        cols.push(colSettings);
      }
    });
    return cols;
  }, [children, columnSettingsCache]);

  const rows = useMemo(() => {
    const rowData: Array<Handsontable.CellProperties & RowSettings> = [];
    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement(child) && child.type === HotRow) {
        const rowSetting = rowSettings.get(index);
        if (rowSetting) {
          rowData.push(rowSetting);
        }
      }
    });
    return rowData;
  }, [children, rowSettings]);

  const defaultSettings = {
    columnSorting: true,
    filters: true,
    dropdownMenu: true,
    ...settings
  };

  const tableSettings = useMemo(() => ({
    ...defaultSettings,
    data: data.length > 0 ? sanitizeData(data) : rows,
    columns,
    width,
    height,
    colWidths: data.length > 0 ? calculateColumnWidths(data) : undefined,
    readOnly,
    rowHeaders,
    colHeaders,
    minRows,
    minCols,
    minSpareRows,
    minSpareCols,
    autoWrapRow,
    autoWrapCol,
    licenseKey,
    afterChange: handleBatchOperations,
    afterValidate: onAfterValidate ? 
      (isValid: boolean, value: any, row: number, prop: string | number) => {
        onAfterValidate(isValid, value, row, prop.toString());
      } : undefined,
    beforeRowMove: onBeforeRowMove,
    afterRowMove: onAfterRowMove,
    beforeColumnMove: onBeforeColumnMove,
    afterColumnMove: onAfterColumnMove,
  }), [
    data, rows, columns, width, height, calculateColumnWidths, readOnly, rowHeaders, colHeaders,
    minRows, minCols, minSpareRows, minSpareCols, autoWrapRow, autoWrapCol,
    licenseKey, onCellChange, onAfterValidate, onBeforeRowMove, onAfterRowMove,
    onBeforeColumnMove, onAfterColumnMove, settings
  ]);

  const enhancedSettings = useMemo(() => ({
    ...tableSettings,
    viewportRowRenderingOffset: 'auto' as const,
    viewportColumnRenderingOffset: 'auto' as const,
    renderAllRows: false,
    renderAllColumns: false,
    fragmentSelection: true,
    outsideClickDeselects: true,
    autoColumnSize: {
      syncLimit: 100
    },
    columnSorting: {
      sortEmptyCells: true,
      indicator: true
    }
  }), [tableSettings]);

  useEffect(() => {
    let isSubscribed = true;
    
    if (ref && 'current' in ref) {
      if (isSubscribed) {
        ref.current = hotRef.current;
      }
    }
    
    return () => {
      isSubscribed = false;
      if (hotRef.current?.hotInstance) {
        hotRef.current.hotInstance.destroy();
      }
    };
  }, [ref]);

  const processChildren = useCallback(() => {
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return null;

      if (child.type === HotColumn) {
        return React.cloneElement(child as React.ReactElement<HotColumnProps>, {
          _columnIndex: index,
          _emitColumnSettings: handleColumnSettings
        });
      }

      if (child.type === HotRow) {
        return React.cloneElement(child as React.ReactElement<HotRowProps>, {
          _rowIndex: index,
          _emitRowSettings: handleRowSettings
        });
      }

      return child;
    });
  }, [children, handleColumnSettings, handleRowSettings]);

  const memoizedChildren = useMemo(() => processChildren(), [children, handleColumnSettings, handleRowSettings]);

  class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
  > {
    state: { hasError: boolean; error: Error | null } = { 
      hasError: false, 
      error: null 
    };

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Tablo hatası:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="error-container">
            <h3>Tablo yüklenirken bir hata oluştu</h3>
            <p>{this.state.error?.message}</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Yeniden Dene
            </button>
          </div>
        );
      }
      return this.props.children;
    }
  }

  const enhancedExportData = useCallback(() => {
    const exportPlugin = hotRef.current?.hotInstance?.getPlugin('exportFile');
    
    if (!exportPlugin) {
      console.error('Export eklentisi bulunamadı');
      return;
    }

    try {
      exportPlugin.downloadFile('csv', {
        filename: `table-data-${new Date().toISOString()}`,
        columnHeaders: true,
        rowHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        mimeType: 'text/csv',
        encoding: 'utf-8'
      });
      onExport?.();
    } catch (error) {
      console.error('Dışa aktarma hatası:', error);
    }
  }, [onExport]);

  useEffect(() => {
    if (hotRef.current) {
      hotRef.current.hotInstance?.addHook('afterInit', enhancedExportData);
    }
  }, [enhancedExportData]);

  const handleError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      error,
      loadingState: 'error'
    }));
    onError?.(error);
    console.error('Tablo hatası:', error);
  }, [onError]);

  useEffect(() => {
    const loadData = async () => {
      if (!data.length) return;
      
      setState(prev => ({
        ...prev,
        loadingState: 'loading'
      }));
      try {
        await Promise.all(data.map(async row => {
          // Veri doğrulama ve işleme
          return row;
        }));
        setState(prev => ({
          ...prev,
          loadingState: 'success'
        }));
      } catch (err) {
        handleError(err instanceof Error ? err : new Error('Bilinmeyen hata'));
      }
    };
    
    loadData();
  }, [data, handleError]);

  const handleBatchOperations = useCallback((changes: Handsontable.CellChange[] | null) => {
    if (!changes?.length) return;
    
    const processBatch = (batch: Handsontable.CellChange[]) => {
      if (onCellChange) {
        queueMicrotask(() => onCellChange(batch));
      }
    };

    const batchSize = 100;
    for (let i = 0; i < changes.length; i += batchSize) {
      processBatch(changes.slice(i, i + batchSize));
    }
  }, [onCellChange]);

  useEffect(() => {
    const currentHotRef = hotRef.current;
    
    return () => {
      if (currentHotRef?.hotInstance) {
        try {
          currentHotRef.hotInstance.destroy();
          hotRef.current = null;
        } catch (error) {
          console.error('Tablo temizleme hatası:', error);
        }
      }
    };
  }, []);

  const memoizedData = useMemo(() => {
    const { isValid, sanitizedData } = validateData(data);
    if (!isValid) {
      onError?.(new Error('Geçersiz veri formatı'));
      return [];
    }
    return sanitizedData;
  }, [data, onError]);

  const sanitizeData = useCallback((inputData: any[]) => {
    return inputData.map(row => 
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === 'string' ? 
            value.replace(/<[^>]*>/g, '').trim() : value
        ])
      )
    );
  }, []);

  const validateData = (data: any[]): ValidationResult => {
    const errors: string[] = [];
    const sanitizedData = sanitizeData(data);
    
    const isValid = data.every((row, index) => {
      if (!row || typeof row !== 'object') {
        errors.push(`Satır ${index + 1}: Geçersiz veri formatı`);
        return false;
      }
      return true;
    });
  
    return {
      isValid,
      errors,
      sanitizedData
    };
  };

  return (
    <ErrorBoundary>
      <div className={cn("custom-hot-table", className)} role="grid">
        {error ? (
          <div className="error-message">Hata: {error.message}</div>
        ) : loadingState === 'loading' ? (
          <div className="loading-spinner">Yükleniyor...</div>
        ) : (
          <HotTable
            ref={hotRef}
            settings={{...enhancedSettings, data: memoizedData}}
          />
        )}
        <div style={{ display: 'none' }}>
          {memoizedChildren}
        </div>
      </div>
    </ErrorBoundary>
  );
});

CustomTable.displayName = "CustomTable";

export { CustomTable, type CustomTableProps }; 