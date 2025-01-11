import { Table } from '@plugins/table/components/Table';

export function TestTabel() {
  const columns = [
    { data: 'id', title: 'ID', type: 'numeric' as const, readOnly: true },
    { data: 'name', title: 'Ad' },
    { data: 'surname', title: 'Soyad' },
    { 
      data: 'group', 
      title: 'Grup',
      type: 'dropdown' as const,
      source: ['Grup1', 'Grup2', 'Grup3']
    },
    { data: 'created_at', title: 'Oluşturulma', type: 'date' as const },
    { data: 'is_active', title: 'Aktif', type: 'checkbox' as const }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Personel Listesi</h1>
      <Table 
        tableName="persons"
        columns={columns}
        width="100%"
        height={600}
      />
    </div>
  );
}
