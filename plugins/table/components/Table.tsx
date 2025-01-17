import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { forwardRef } from 'react';
import { HotTable, HotTableProps, HotTableRef } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import { invoke } from '@tauri-apps/api/core';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import { cn } from '@/lib/utils';

registerAllModules();

interface TableData {
  [key: string]: any;
}

interface TableBlock {
  id: string;
  baslik: string;
  aciklama: React.ReactNode;
  data: TableData[];
}

export interface TableProps extends HotTableProps {
  data?: TableData[];
  tableName?: string;
  blocks?: TableBlock[];
  columns?: Array<{
    data: string;
    title: string;
    type?: 'text' | 'numeric' | 'date' | 'checkbox' | 'dropdown';
    source?: string[];
    readOnly?: boolean;
  }>;
  children?: React.ReactNode;
  readOnly?: boolean;
  width?: string | number;
  height?: string | number;
  onDataChange?: (changes: any[] | null) => void;
  blockClassName?: string;
  blockHeaderClassName?: string;
  blockDescriptionClassName?: string;
  renderBlockHeader?: (block: TableBlock) => React.ReactNode;
  renderBlockDescription?: (block: TableBlock) => React.ReactNode;
  renderBlockWrapper?: (block: TableBlock, children: React.ReactNode) => React.ReactNode;
}

export const Table = forwardRef<HotTableRef, TableProps>(({
  data: initialData,
  tableName,
  blocks: initialBlocks,
  columns: initialColumns,
  children,
  readOnly = false,
  width = '100%',
  height = 'auto',
  onDataChange,
  blockClassName,
  blockHeaderClassName,
  blockDescriptionClassName,
  renderBlockHeader,
  renderBlockDescription,
  renderBlockWrapper,
  ...props
}, ref) => {
  const [data, setData] = useState<TableData[]>(initialData || []);
  const [blocks, setBlocks] = useState<TableBlock[]>(initialBlocks || []);
  const [loading, setLoading] = useState(!!tableName);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const childColumns = React.Children.toArray(children)
    .filter((child): child is React.ReactElement => 
      React.isValidElement(child) && 
      typeof child.type === 'function' && 
      'displayName' in child.type && 
      child.type.displayName === 'Column'
    )
    .map((child) => child.props);

  const finalColumns = useMemo(() => {
    const cols = initialColumns || childColumns;
    return cols.map(column => ({
      ...column,
      width: 150,
      title: column.title,
      wordWrap: true
    }));
  }, [initialColumns, childColumns]);

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

  const fetchBlocksData = async () => {
    if (!blocks) return;
    try {
      setLoading(true);
      const result = blocks.map(block => ({
        ...block.data
      }));
      setData(result);
    } catch (error) {
      console.error(`Veri yüklenirken hata oluştu: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockDataChange = useCallback(async (blockId: string, changes: any[]) => {
    if (!changes || !blocks) return;

    const updatedBlocks = blocks.map(block => {
      if (block.id !== blockId) return block;

      const updatedData = [...block.data];
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (updatedData[row]) {
          updatedData[row] = {
            ...updatedData[row],
            [prop]: newValue
          };
        }
      });

      return {
        ...block,
        data: updatedData
      };
    });

    setBlocks(updatedBlocks);
    onDataChange?.(changes.map(change => ({ blockId, ...change })));
  }, [blocks, onDataChange]);

  const handleAfterChange = async (changes: any[] | null) => {
    if (!changes) return;
    onDataChange?.(changes);

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

  const handleBlockClick = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
    blockRefs.current[blockId]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }, []);

  const calculateHeight = useCallback((data: any[]) => {
    const rowHeight = 23; // Varsayılan satır yüksekliği
    const headerHeight = 30; // Başlık yüksekliği
    const minHeight = 100; // Minimum yükseklik
    
    return height === 'auto' 
      ? Math.max(minHeight, (data.length * rowHeight) + headerHeight)
      : height;
  }, [height]);

  const calculateWidth = useCallback((data: any[], columns: any[]) => {
    const charWidth = 10; // Ortalama karakter genişliği (piksel)
    const padding = 40; // Hücre padding'i
    
    // Sütun başlıklarının genişliği
    const headerWidths = columns.map(col => (col.title?.length || 0) * charWidth + padding);
    
    // Veri hücrelerinin genişliği
    const cellWidths = columns.map(col => {
      const maxLength = Math.max(...data.map(row => String(row[col.data]).length));
      return maxLength * charWidth + padding;
    });

    // Her sütun için maksimum genişliği al
    const finalWidths = headerWidths.map((headerWidth, index) => 
      Math.max(headerWidth, cellWidths[index])
    );

    // Toplam genişlik
    return finalWidths.reduce((sum, width) => sum + width, 0) + 100; // Extra padding
  }, []);

  const renderBlock = useCallback((block: TableBlock) => {
    const tableHeight = calculateHeight(block.data);
    
    const defaultBlockContent = (
      <>
        {renderBlockHeader?.(block) ?? (
          <h2 className={cn(
            "text-xl font-semibold mb-2",
            blockHeaderClassName
          )}>
            {block.baslik}
          </h2>
        )}
        
        {renderBlockDescription?.(block) ?? (
          <div className={cn(
            "text-gray-600 mb-4",
            blockDescriptionClassName
          )}>
            {block.aciklama}
          </div>
        )}
        
        <HotTable
          ref={ref}
          data={block.data}
          columns={finalColumns}
          height={tableHeight}
          stretchH="all"
          width="100%"
          autoColumnSize={true}
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
          afterChange={(changes) => changes && handleBlockDataChange(block.id, changes)}
          className="htCenter"
          {...props}
        />
      </>
    );

    if (renderBlockWrapper) {
      return renderBlockWrapper(block, defaultBlockContent);
    }

    return (
      <div 
        key={block.id} 
        ref={el => blockRefs.current[block.id] = el}
        className={cn(
          "mb-6 p-6 rounded-xl w-full",
          activeBlockId === block.id ? "ring-2 ring-blue-500 ring-opacity-50" : "",
          blockClassName
        )}
      >
        {defaultBlockContent}
      </div>
    );
  }, [finalColumns, width, height, readOnly, handleBlockDataChange, activeBlockId, blockClassName, blockHeaderClassName, blockDescriptionClassName, renderBlockHeader, renderBlockDescription, renderBlockWrapper]);

  useEffect(() => {
    if (initialBlocks) setBlocks(initialBlocks);
  }, [initialBlocks]);

  useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setLoading(!!tableName);
  }, [tableName]);

  useEffect(() => {
    if (tableName) {
      fetchData();
    } else if (initialData) {
      setData(initialData);
    } else if (blocks) {
      fetchBlocksData();
    }
  }, [tableName, initialData, initialBlocks]);

  useEffect(() => {
    return () => {
      // Tablo bileşeni temizleme işlemleri
      // - Event listener'ları temizle
      // - Açık olan menüleri kapat
      // - Seçili hücreleri temizle
      // - Hafızadaki veriyi temizle
      setData([]);
      setBlocks([]);
      setLoading(false);
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {blocks?.map(renderBlock)}
        {!blocks && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <HotTable {...props} />
          </div>
        )}
      </div>
    </div>
  );
});

Table.displayName = 'Table';
