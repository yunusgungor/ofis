import { Table } from '@/components/ui/table';
import { Column } from '@/components/ui/column';
import type { Employee } from '@/types/employee';

interface EmployeeTableProps {
  employees?: Employee[];
  onEmployeeChange?: (changes: any[] | null) => void;
  onRowMove?: (movedRows: number[], finalIndex: number) => void;
  onColumnMove?: (movedColumns: number[], finalIndex: number) => void;
  readOnly?: boolean;
  width?: number;
}

export function EmployeeTable({
  employees = [],
  onEmployeeChange,
  onRowMove,
  onColumnMove,
  readOnly = false,
  width = 500
}: EmployeeTableProps) {
  const columns = [
    { data: 'id', title: 'ID', readOnly: true },
    { data: 'name', title: 'Ad' },
    { data: 'surname', title: 'Soyad' },
    { data: 'groupId', title: 'Grup' }
  ];

  return (
    <Table
      data={employees}
      columns={columns}
      onCellChange={onEmployeeChange}
      readOnly={readOnly}
      width={width}
      height={400}
      manualRowMove={true}
      manualColumnMove={true}
      afterRowMove={onRowMove}
      afterColumnMove={onColumnMove}
      rowHeaders={true}
      colHeaders={true}
    >
      {columns.map((col) => (
        <Column 
          key={col.data}
          data={col.data}
          title={col.title}
          readOnly={col.readOnly}
        />
      ))}
    </Table>
  );
}