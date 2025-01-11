```tsx
import { useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import TableNode from '@plugins/flow/nodes/TableNode';

import '@xyflow/react/dist/style.css';

/**
 * Calculates the width of a node based on its data and column headers.
 * 
 * @param data The data of the node.
 * @param colHeaders The column headers of the node.
 * @returns The calculated width of the node.
 */
const calculateNodeWidth = (data: any[][], colHeaders: string[]): number => {
  const charWidth: number = 10; // Ortalama karakter genişliği (piksel)
  const padding: number = 40; // Hücre padding'i
  
  // Sütun başlıklarının genişliği
  const headerWidths: number[] = colHeaders.map((header: string) => header.length * charWidth + padding);
  
  // Veri hücrelerinin genişliği
  const cellWidths: number[] = data[0].map((_, colIndex: number) => {
    const columnData: string[] = data.map((row: any[]) => String(row[colIndex]));
    const maxLength: number = Math.max(...columnData.map((cell: string) => cell.length));
    return maxLength * charWidth + padding;
  });

  // Her sütun için maksimum genişliği al
  const finalWidths: number[] = headerWidths.map((headerWidth: number, index: number) => 
    Math.max(headerWidth, cellWidths[index])
  );

  // Toplam genişlik
  return finalWidths.reduce((sum: number, width: number) => sum + width, 0) + 100; // Extra padding için +100
};

/**
 * Initial nodes for the flow.
 */
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'tableNode',
    position: { x: 100, y: 100 },
    data: {
      data: [
        ['A1', 'B1', 'C1'],
        ['A2', 'B2', 'C2'],
        ['A3', 'B3', 'C3'],
      ],
      colHeaders: ['Column 1', 'Column 2', 'Column 3'],
      width: 0 // Genişlik dinamik olarak hesaplanacak
    }
  },
  {
    id: '2',
    type: 'tableNode',
    position: { x: 500, y: 100 },
    data: {
      data: [
        ['X1', 'Y1', 'Z1'],
        ['X2', 'Y2', 'Z2'],
      ],
      colHeaders: ['X', 'Y', 'Z'],
      width: 0
    }
  }
];

/**
 * Flow component.
 */
export const Flow = () => {
  const processedNodes: Node[] = initialNodes.map((node: Node) => ({
    ...node,
    data: {
      ...node.data,
      width: calculateNodeWidth(
        (node.data as { data: any[][]; colHeaders: string[] }).data,
        (node.data as { data: any[][]; colHeaders: string[] }).colHeaders
      )
    }
  }));

  const nodeTypes = useMemo(() => ({
    tableNode: TableNode
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(processedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
```