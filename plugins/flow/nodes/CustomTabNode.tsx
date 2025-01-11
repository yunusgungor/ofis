// CustomTabNode.tsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface TabsNodeProps {
  data: {
    tabs: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  };
}

const CustomTabNode: React.FC<TabsNodeProps> = ({ data }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div
      style={{
        background: 'white',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        minWidth: '200px'
      }}
    >
      {/* Source handle - diğer node'lara bağlantı için */}
      <Handle type="source" position={Position.Right} />
      
      {/* Tabs header */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
        {data.tabs.map((tab, index) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(index)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              backgroundColor: activeTab === index ? '#eee' : 'transparent'
            }}
          >
            {tab.title}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '10px' }}>
        {data.tabs[activeTab].content}
      </div>

      {/* Target handle - diğer node'lardan gelen bağlantılar için */}
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default CustomTabNode;