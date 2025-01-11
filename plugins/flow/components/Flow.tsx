import { ReactFlowProvider } from '@xyflow/react';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Slide, SLIDE_WIDTH } from '../nodes/Slide';

const nodeTypes = {
  slide: Slide,
};

export const Flow = () => {

  const nodes = [
    {
      id: '0',
      type: 'slide',
      position: { x: 0, y: 0 },
      data: { source: '# Hello, React Flow!' },
    },
    {
      id: '1',
      type: 'slide',
      position: { x: SLIDE_WIDTH, y: 0 },
      data: { source: '...' },
    },
    {
      id: '2',
      type: 'slide',
      position: { x: SLIDE_WIDTH * 2, y: 0 },
      data: { source: '...' },
    },
  ];

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
      />;
    </ReactFlowProvider>
  );
};

