Handsontable kullanarak iş yönetimi için UI bileşenleri geliştirmeye yardımcı olabilirim. Öncelikle ihtiyaçları analiz edelim:

### İhtiyaç Analizi:

1. **Temel Bileşenler:**
- Personel Tablosu
- Grup Tablosu 
- Vardiya Tablosu
- Atama Tablosu

2. **Veri Yapısı:**
```typescript
// Personel tipi
interface Employee {
  id: string;
  name: string;
  surname: string;
  groupId?: string;
}

// Grup tipi
interface Group {
  id: string;
  name: string;
  employees: string[]; // employee id'leri
}

// Vardiya tipi
interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

// Atama tipi
interface Assignment {
  id: string;
  groupId: string;
  shiftId: string;
  date: string;
}
```

İlk olarak, temel bir Handsontable wrapper bileşeni oluşturalım:

```typescript:src/components/ui/data-table.tsx
import { useEffect, useRef } from 'react';
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react-wrapper';
import "handsontable/dist/handsontable.min.css";

interface DataTableProps {
  data: any[];
  columns: Handsontable.ColumnSettings[];
  height?: number;
  width?: number;
  readOnly?: boolean;
  onCellChange?: (changes: any[]) => void;
}

export function DataTable({
  data,
  columns,
  height = 400,
  width = '100%',
  readOnly = false,
  onCellChange
}: DataTableProps) {
  const hotRef = useRef<Handsontable | null>(null);

  return (
    <HotTable
      ref={hotRef}
      data={data}
      columns={columns}
      height={height}
      width={width}
      rowHeaders={true}
      colHeaders={true}
      readOnly={readOnly}
      licenseKey="non-commercial-and-evaluation"
      afterChange={(changes) => {
        if (changes && onCellChange) {
          onCellChange(changes);
        }
      }}
      contextMenu={true}
      className="htCenter"
    />
  );
}
```

Şimdi personel tablosu için bir bileşen oluşturalım:

```typescript:src/components/tables/employee-table.tsx
import { DataTable } from '../ui/data-table';
import type { Employee } from '@/types';

interface EmployeeTableProps {
  employees: Employee[];
  onEmployeeChange?: (changes: any[]) => void;
  readOnly?: boolean;
}

export function EmployeeTable({
  employees,
  onEmployeeChange,
  readOnly = false
}: EmployeeTableProps) {
  const columns = [
    { data: 'id', title: 'ID', readOnly: true },
    { data: 'name', title: 'Ad' },
    { data: 'surname', title: 'Soyad' },
    { data: 'groupId', title: 'Grup ID' }
  ];

  return (
    <DataTable
      data={employees}
      columns={columns}
      readOnly={readOnly}
      onCellChange={onEmployeeChange}
    />
  );
}
```

Bu temel yapıyı kullanarak diğer tablolar için de benzer bileşenler oluşturabiliriz. Handsontable'ın sunduğu özellikler:

1. Sıralama
2. Filtreleme
3. Veri doğrulama
4. Bağlamsal menü
5. Sürükle-bırak
6. Toplu düzenleme

İlerleyen aşamalarda şunları ekleyebiliriz:

1. Vardiya çizelgesi görünümü
2. Grup bazlı filtreleme
3. Tarih bazlı vardiya atamaları
4. Çakışma kontrolü
5. Raporlama görünümleri

Devam etmek ister misiniz? Hangi bileşeni detaylandırmamı istersiniz?

---

Tamam, öncelikle sütun ve satır bileşenlerini oluşturalım:

```typescript:src/components/ui/table/column.tsx
import * as React from "react"
import type Handsontable from 'handsontable';
import { cn } from "@/lib/utils"

export interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string;
  title?: string;
  type?: 'text' | 'numeric' | 'date' | 'dropdown' | 'checkbox';
  width?: number;
  readOnly?: boolean;
  className?: string;
  validator?: (value: any, callback: (valid: boolean) => void) => void;
  source?: string[];
}

const Column = React.forwardRef<
  HTMLDivElement,
  ColumnProps
>(({ 
  className,
  data,
  title,
  type = 'text',
  width,
  readOnly = false,
  validator,
  source,
  ...props 
}, ref) => {
  const columnSettings: Handsontable.ColumnSettings = {
    data,
    type,
    title: title || data,
    width,
    readOnly,
    validator,
    source
  };

  return (
    <div
      ref={ref}
      className={cn("hot-column", className)}
      data-column-settings={JSON.stringify(columnSettings)}
      {...props}
    />
  );
});

Column.displayName = "Column";

export { Column };
```

```typescript:src/components/ui/table/row.tsx
import * as React from "react"
import type Handsontable from 'handsontable';
import { cn } from "@/lib/utils"

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>;
  height?: number;
  readOnly?: boolean;
  className?: string;
}

const Row = React.forwardRef<
  HTMLDivElement,
  RowProps
>(({ 
  className,
  data,
  height,
  readOnly = false,
  ...props 
}, ref) => {
  const rowSettings: Handsontable.RowSettings = {
    height,
    readOnly
  };

  return (
    <div
      ref={ref}
      className={cn("hot-row", className)}
      data-row-settings={JSON.stringify(rowSettings)}
      data-row-data={JSON.stringify(data)}
      {...props}
    />
  );
});

Row.displayName = "Row";

export { Row };
```

Şimdi bu bileşenleri kullanacak ana tablo bileşenini oluşturalım:

```typescript:src/components/ui/table/table.tsx
import * as React from "react"
import { HotTable } from '@handsontable/react-wrapper';
import type Handsontable from 'handsontable';
import { cn } from "@/lib/utils"

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  data?: any[];
  height?: number;
  width?: number | string;
  readOnly?: boolean;
  licenseKey?: string;
  className?: string;
  onCellChange?: (changes: any[] | null) => void;
}

const Table = React.forwardRef<
  Handsontable,
  TableProps
>(({ 
  className,
  children,
  data = [],
  height = 400,
  width = '100%',
  readOnly = false,
  licenseKey = 'non-commercial-and-evaluation',
  onCellChange,
  ...props 
}, ref) => {
  // Sütun ayarlarını children'dan toplama
  const columns = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.type['displayName'] === 'Column')
    .map((child) => {
      const element = child as React.ReactElement;
      return JSON.parse(element.props['data-column-settings']);
    });

  // Satır verilerini children'dan toplama
  const rowData = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.type['displayName'] === 'Row')
    .map((child) => {
      const element = child as React.ReactElement;
      return JSON.parse(element.props['data-row-data']);
    });

  const tableData = data.length > 0 ? data : rowData;

  return (
    <div className={cn("hot-table-container", className)} {...props}>
      <HotTable
        ref={ref}
        data={tableData}
        columns={columns}
        height={height}
        width={width}
        rowHeaders={true}
        colHeaders={true}
        readOnly={readOnly}
        licenseKey={licenseKey}
        afterChange={onCellChange}
        contextMenu={true}
        className="htCenter"
      />
    </div>
  );
});

Table.displayName = "Table";

export { Table };
```

Bu bileşenleri kullanarak örnek bir personel tablosu oluşturalım:

```typescript:src/components/tables/employee-table.tsx
import { Table } from '../ui/table/table';
import { Column } from '../ui/table/column';
import { Row } from '../ui/table/row';
import type { Employee } from '@/types';

interface EmployeeTableProps {
  employees?: Employee[];
  onEmployeeChange?: (changes: any[]) => void;
  readOnly?: boolean;
}

export function EmployeeTable({
  employees = [],
  onEmployeeChange,
  readOnly = false
}: EmployeeTableProps) {
  return (
    <Table
      data={employees}
      onCellChange={onEmployeeChange}
      readOnly={readOnly}
    >
      <Column 
        data="id" 
        title="ID" 
        readOnly={true} 
      />
      <Column 
        data="name" 
        title="Ad" 
        validator={(value, callback) => {
          callback(value.length >= 2);
        }}
      />
      <Column 
        data="surname" 
        title="Soyad" 
        validator={(value, callback) => {
          callback(value.length >= 2);
        }}
      />
      <Column 
        data="groupId" 
        title="Grup" 
        type="dropdown"
        source={['Grup1', 'Grup2', 'Grup3']} 
      />
    </Table>
  );
}
```

Kullanım örneği:

```typescript:src/pages/employees.tsx
import { EmployeeTable } from '@/components/tables/employee-table';

const employeesData = [
  { id: '1', name: 'Ahmet', surname: 'Yılmaz', groupId: 'Grup1' },
  { id: '2', name: 'Mehmet', surname: 'Demir', groupId: 'Grup2' },
];

export function EmployeesPage() {
  const handleEmployeeChange = (changes: any[]) => {
    console.log('Değişiklikler:', changes);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Personel Listesi</h1>
      <EmployeeTable 
        employees={employeesData}
        onEmployeeChange={handleEmployeeChange}
      />
    </div>
  );
}
```

Bu yapı şu avantajları sağlar:

1. Daha deklaratif bir API
2. Tip güvenliği
3. Kolay özelleştirme
4. Yeniden kullanılabilirlik
5. Bileşen bazlı validasyon
6. Daha iyi kod organizasyonu

İhtiyaca göre şu özellikleri de ekleyebiliriz:

1. Sıralama kontrolü
2. Özel hücre renderlama
3. Koşullu biçimlendirme
4. Toplu işlem kontrolü
5. Özel filtreler

Başka eklemek istediğiniz özellik var mı?

---

