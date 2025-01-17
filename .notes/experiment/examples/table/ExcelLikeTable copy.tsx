import { useRef, useState, useEffect } from 'react';
import { HotTable, HotTableRef } from '@handsontable/react-wrapper';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { HyperFormula } from 'hyperformula';

registerAllModules();

interface CellStyle {
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
}

const ExcelLikeTable = () => {
  const hotRef = useRef<HotTableRef>(null);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [formulaValue, setFormulaValue] = useState('');
  const [cellStyles, setCellStyles] = useState<Record<string, CellStyle>>({});
  const [tableData, setTableData] = useState<(string | null)[][]>(() => 
    Array.from({ length: 100 }, () => Array.from({ length: 26 }, () => null))
  );

  const columns = Array.from({ length: 26 }, (_, index) => ({
    data: String.fromCharCode(65 + index),
    title: String.fromCharCode(65 + index),
    width: 150,
    wordWrap: true
  }));

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Seçili hücreyi izle
  const afterSelection = (row: number, col: number) => {
    setSelectedCell({ row, col });
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      const value = hot.getDataAtCell(row, col);
      setFormulaValue(value || '');
    }
  };

  // Veri değişikliklerini izle
  const handleDataChange = (changes: any[] | null) => {
    if (!changes) return;
    
    const newData = [...tableData];
    changes.forEach(([row, col, oldValue, newValue]) => {
      newData[row][col] = newValue;
    });
    setTableData(newData);
  };

  // Formül değişikliklerini izle
  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaValue(e.target.value);
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      const newData = [...tableData];
      newData[selectedCell.row][selectedCell.col] = e.target.value;
      setTableData(newData);
      hot.setDataAtCell(selectedCell.row, selectedCell.col, e.target.value);
    }
  };

  // Toolbar işlevleri
  const handleToolbarAction = (action: string) => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const range = hot.getSelectedRange();
    if (!range) return;

    const styles = { ...cellStyles };
    range.forEach((cellRange) => {
      for (let row = cellRange.from.row; row <= cellRange.to.row; row++) {
        for (let col = cellRange.from.col; col <= cellRange.to.col; col++) {
          const key = `${row}-${col}`;
          styles[key] = styles[key] || {};

          switch (action) {
            case 'bold':
              styles[key].fontWeight = styles[key].fontWeight === 'bold' ? 'normal' : 'bold';
              break;
            case 'italic':
              styles[key].fontStyle = styles[key].fontStyle === 'italic' ? 'normal' : 'italic';
              break;
            case 'underline':
              styles[key].textDecoration = styles[key].textDecoration === 'underline' ? 'none' : 'underline';
              break;
            case 'alignLeft':
              styles[key].textAlign = 'left';
              break;
            case 'alignCenter':
              styles[key].textAlign = 'center';
              break;
            case 'alignRight':
              styles[key].textAlign = 'right';
              break;
          }
        }
      }
    });

    setCellStyles(styles);
    hot.render();
  };

  // Hücre renderer'ı
  const cells = function(row: number, col: number) {
    return {
      renderer: function(instance: any, td: HTMLTableCellElement, row: number, col: number, prop: any, value: any, cellProperties: any) {
        Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
        
        const key = `${row}-${col}`;
        const style = cellStyles[key];
        if (style) {
          Object.assign(td.style, style);
        }
        
        return td;
      }
    };
  };

  return (
    <div className="excel-table-wrapper">
      <div className="excel-toolbar">
        <div className="toolbar-group">
          <button className="toolbar-button" onClick={() => handleToolbarAction('bold')}>
            <span className="material-icons">format_bold</span>
          </button>
          <button className="toolbar-button" onClick={() => handleToolbarAction('italic')}>
            <span className="material-icons">format_italic</span>
          </button>
          <button className="toolbar-button" onClick={() => handleToolbarAction('underline')}>
            <span className="material-icons">format_underlined</span>
          </button>
        </div>
        <div className="toolbar-group">
          <button className="toolbar-button" onClick={() => handleToolbarAction('alignLeft')}>
            <span className="material-icons">format_align_left</span>
          </button>
          <button className="toolbar-button" onClick={() => handleToolbarAction('alignCenter')}>
            <span className="material-icons">format_align_center</span>
          </button>
          <button className="toolbar-button" onClick={() => handleToolbarAction('alignRight')}>
            <span className="material-icons">format_align_right</span>
          </button>
        </div>
      </div>

      <div className="formula-bar">
        <span className="cell-address">
          {String.fromCharCode(65 + selectedCell.col)}{selectedCell.row + 1}
        </span>
        <input 
          type="text" 
          className="formula-input" 
          placeholder="fx"
          value={formulaValue}
          onChange={handleFormulaChange}
        />
      </div>

      <div className="table-container">
        <HotTable 
          ref={hotRef}
          data={tableData}
          columns={columns}
          rowHeaders={true}
          colHeaders={true}
          manualColumnMove={true}
          manualRowMove={true}
          manualColumnResize={true}
          manualRowResize={true}
          contextMenu={true}
          comments={true}
          mergeCells={true}
          autoColumnSize={{
            syncLimit: 300,
            useHeaders: true,
            samplingRatio: 0.3
          }}
          stretchH="all"
          autoRowSize={true}
          dropdownMenu={true}
          multiColumnSorting={true}
          afterChange={handleDataChange}
          afterSelection={afterSelection}
          cells={cells}
          formulas={{
            engine: HyperFormula,
            sheetName: 'Sheet1',
          }}
          height="calc(100vh - 120px)"
          licenseKey="non-commercial-and-evaluation"
          className="excel-table"
          wordWrap={true}
        />
      </div>

      <style>{`
        .excel-table-wrapper {
          background: #ffffff;
          height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        .excel-toolbar {
          background: #ffffff;
          border-bottom: 1px solid #eaeaea;
          padding: 12px 24px;
          display: flex;
          gap: 32px;
        }

        .toolbar-group {
          display: flex;
          gap: 12px;
          padding-right: 32px;
          position: relative;
        }

        .toolbar-button {
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          color: #666;
          transition: all 0.2s ease;
        }

        .toolbar-button:hover {
          background: #f5f5f5;
          color: #000;
        }

        .formula-bar {
          background: #ffffff;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #eaeaea;
        }

        .cell-address {
          font-size: 13px;
          color: #666;
          background: #f5f5f5;
          padding: 6px 12px;
          border-radius: 6px;
          min-width: 60px;
          text-align: center;
        }

        .formula-input {
          flex: 1;
          border: 1px solid #eaeaea;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .formula-input:focus {
          outline: none;
          border-color: #000;
        }

        .excel-table .handsontable {
          font-family: inherit;
          font-size: 13px;
        }

        .excel-table .handsontable td {
          padding: 4px 8px;
          height: auto;
          line-height: 1.4;
          white-space: normal;
          overflow: visible;
          max-width: 150px;
          word-break: break-word;
        }

        .excel-table .handsontable th {
          padding: 0;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          font-weight: 500;
        }

        .excel-table .handsontable .current {
          border: 2px solid #000 !important;
        }

        .excel-table .handsontable tbody th.ht__highlight,
        .excel-table .handsontable thead th.ht__highlight {
          background: #f5f5f5;
        }

        .excel-table .handsontable .htCore td.area {
          background: rgba(0, 0, 0, 0.05);
        }

        .excel-table .handsontable .htCore td.area.current {
          background: rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default ExcelLikeTable;