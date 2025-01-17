import { useState, useCallback, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.min.css';
import 'handsontable/dist/handsontable.full.min.css';
import Handsontable from 'handsontable';

const DynamicStyledHandsontable = () => {
  const hotRef = useRef(null);
  
  // Stil durumlarını yönetmek için state'ler
  const [currentTheme, setCurrentTheme] = useState('light');
  const [highlightedCells, setHighlightedCells] = useState<string[]>([]);
  const [activeColumns, setActiveColumns] = useState<number[]>([]);

  // Örnek veri
  const data = [
    ['Model', 'Marka', 'Yıl', 'Fiyat'],
    ['A3', 'Audi', 2019, 50000],
    ['C200', 'Mercedes', 2020, 60000],
    ['320i', 'BMW', 2021, 55000],
  ];

  // Dinamik hücre stilleri
  const getCellStyle = useCallback((row: number, col: number, value: any) => {
    const styles: React.CSSProperties = {};

    // Tema bazlı stiller
    if (currentTheme === 'dark') {
      styles.backgroundColor = '#2d2d2d';
      styles.color = '#ffffff';
    }

    // Vurgulanmış hücreler
    if (highlightedCells.includes(`${row}-${col}` as never)) {
      styles.backgroundColor = '#ffeb3b';
      styles.fontWeight = 'bold';
    }

    // Aktif sütunlar
    if (activeColumns.includes(col as never)) {
      styles.borderLeft = '2px solid #1a73e8';
      styles.borderRight = '2px solid #1a73e8';
    }
    
    // Değer bazlı koşullu stiller
    if (typeof value === 'number') {
      if (value > 55000) {
        styles.color = '#e53935';
      } else if (value < 55000) {
        styles.color = '#43a047';
      }
    }

    return styles;
  }, [currentTheme, highlightedCells, activeColumns]);

  // Tablo ayarları
  const settings = {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    height: 'auto',
    licenseKey: 'non-commercial-and-evaluation',

    // Hücre renderer'ı
    cells: function(row: number, col: number) {
      return {
        renderer: function(instance: any, td: any, row: number, col: number, prop: any, value: any, cellProperties: any) {
          // Varsayılan renderer
          Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
          
          // Dinamik stilleri uygula
          const styles = getCellStyle(row, col, value);
          Object.assign(td.style, styles);

          // Başlık satırı için özel stil
          if (row === 0) {
            td.style.fontWeight = 'bold';
            td.style.backgroundColor = currentTheme === 'dark' ? '#1a1a1a' : '#f5f5f5';
          }

          return td;
        }
      };
    },

    // Seçim olayları
    afterSelection: (row: number, col: number) => {
      const cellKey = `${row}-${col}`;
      setHighlightedCells(prev => 
        prev.includes(cellKey) 
          ? prev.filter(key => key !== cellKey)
          : [...prev, cellKey]
      );
    },

    // Sütun başlığı tıklama olayı
    afterColumnSort: (column: any) => {
      setActiveColumns(prev => 
        prev.includes(column) 
          ? prev.filter(col => col !== column)
          : [...prev, column]
      );
    }
  };

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // CSS Stilleri
  const containerStyle = {
    padding: '20px',
    backgroundColor: currentTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    transition: 'background-color 0.3s ease'
  };

  const controlsStyle = {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px'
  };

  return (
    <div style={containerStyle}>
      <div style={controlsStyle}>
        <button onClick={toggleTheme}>
          {currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <button onClick={() => setHighlightedCells([])}>
          Vurgulamaları Temizle
        </button>
        <button onClick={() => setActiveColumns([])}>
          Aktif Sütunları Sıfırla
        </button>
      </div>

      <HotTable
        ref={hotRef}
        settings={settings}
      />

      <style>{`
        .handsontable {
          transition: all 0.3s ease;
          font-family: Arial, sans-serif;
        }

        .handsontable td {
          transition: background-color 0.3s ease,
                      color 0.3s ease,
                      border-color 0.3s ease;
        }

        .handsontable th {
          background-color: ${currentTheme === 'dark' ? '#1a1a1a' : '#f5f5f5'};
          color: ${currentTheme === 'dark' ? '#ffffff' : '#000000'};
        }

        .handsontable .htCore td.highlight {
          background-color: #ffeb3b !important;
        }

        .handsontable .htCore td:hover {
          background-color: ${currentTheme === 'dark' ? '#3d3d3d' : '#e3f2fd'};
        }
      `}</style>
    </div>
  );
};

export default DynamicStyledHandsontable;