// TableNode.tsx
import { FC, memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

interface TableNodeData {
  data: any[][];
  colHeaders: string[];
}

const TableNode: FC<NodeProps> = ({ data }) => {
  const nodeData = data as unknown as TableNodeData & { width: number };
  
  const onBeforeHotKeyDown = useCallback((event: KeyboardEvent) => {
    event.stopPropagation();
  }, []);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    // Tablo içindeki etkileşimlerde event'i durdur
    event.stopPropagation();
  }, []);

  return (
    <div 
      style={{
        padding: '10px',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '5px',
        minWidth: `${nodeData.width}px`,
        width: `${nodeData.width}px`,
        maxWidth: `${nodeData.width}px`
      }}
      onMouseDown={onMouseDown}
      className="nodrag"
    >
      <Handle type="target" position={Position.Left} />
      
      <HotTable
        data={nodeData.data}
        colHeaders={nodeData.colHeaders}
        rowHeaders={true}
        height={200}
        width={nodeData.width - 20}
        licenseKey="non-commercial-and-evaluation"
        beforeKeyDown={onBeforeHotKeyDown}
        settings={{
          readOnly: false,
          contextMenu: true,
          stretchH: 'all'
        }}
      />

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(TableNode);