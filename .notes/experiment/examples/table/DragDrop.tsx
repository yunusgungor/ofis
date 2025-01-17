import { useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();

const ModernDragDropTable = () => {
  const hotRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const data = [
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
    ['A3', 'B3', 'C3']
  ];

  const columns = [
    { title: 'Sütun 1', width: 150 },
    { title: 'Sütun 2', width: 150 },
    { title: 'Sütun 3', width: 150 }
  ];

  return (
    <div className="modern-table-wrapper">
      <div className="table-header">
        <h2>Modern Tablo</h2>
        <div className="table-actions">
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '✓ Düzenlemeyi Bitir' : '✎ Düzenle'}
          </button>
        </div>
      </div>

      <div className="table-container">
        <HotTable 
          ref={hotRef}
          data={data}
          columns={columns}
          rowHeaders={true}
          colHeaders={true}
          manualColumnMove={true}
          manualRowMove={true}
          dragToScroll={true}
          dropdownMenu={true}
          contextMenu={true}
          readOnly={!isEditing}
          licenseKey="non-commercial-and-evaluation"
          height={400}
          stretchH="all"
          className="modern-table"
        />
      </div>

      <style>{`
        .modern-table-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          padding: 1.5rem;
          margin: 1rem;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .table-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .table-actions button {
          background: ${isEditing ? '#4299e1' : '#edf2f7'};
          color: ${isEditing ? 'white' : '#4a5568'};
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .table-actions button:hover {
          background: ${isEditing ? '#3182ce' : '#e2e8f0'};
        }

        .table-container {
          border-radius: 8px;
          overflow: hidden;
        }

        .modern-table .handsontable {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .modern-table .handsontable th {
          background: #f7fafc;
          color: #4a5568;
          font-weight: 600;
          padding: 12px 8px;
          border-color: #edf2f7;
        }

        .modern-table .handsontable td {
          padding: 12px 8px;
          border-color: #edf2f7;
          transition: background 0.2s;
        }

        .modern-table .handsontable tr:hover td {
          background: #f7fafc;
        }

        .modern-table .handsontable td.current {
          background: #ebf8ff;
        }

        .modern-table .handsontable .manualColumnMover,
        .modern-table .handsontable .manualRowMover {
          background: #4299e1;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default ModernDragDropTable;