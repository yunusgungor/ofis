import { Table } from '@plugins/table/components/Table';
import { useState } from 'react';

interface VeriBlok {
  id: string;
  baslik: string;
  aciklama: React.ReactNode;
  data: Personel[];
}

interface Personel {
  id: number;
  ad: string;
  soyad: string;
  departman: string;
  maas: number;
}

export function OrnekBlockTablo() {
  const [blocks] = useState<VeriBlok[]>([
    {
      id: 'blok1',
      baslik: 'Yazılım Departmanı',
      aciklama: '',
      data: [
        {
          id: 1,
          ad: 'Ahmet',
          soyad: 'Yılmaz',
          departman: 'Frontend',
          maas: 20000
        },
        {
          id: 2,
          ad: 'Mehmet',
          soyad: 'Kaya',
          departman: 'Backend',
          maas: 22000
        }
      ]
    },
    {
      id: 'blok2',
      baslik: 'Tasarım Departmanı',
      aciklama: '',
      data: [
        {
          id: 3,
          ad: 'Ayşe',
          soyad: 'Demir',
          departman: 'UI/UX',
          maas: 18000
        },
        {
          id: 4,
          ad: 'Fatma',
          soyad: 'Şahin',
          departman: 'Grafik',
          maas: 17000
        }
      ]
    }
  ]);

  const columns = [
    { data: 'id', title: 'ID', type: 'numeric' as const, readOnly: true },
    { data: 'ad', title: 'Ad', type: 'text' as const },
    { data: 'soyad', title: 'Soyad', type: 'text' as const },
    { data: 'departman', title: 'Departman', type: 'text' as const },
    { data: 'maas', title: 'Maaş', type: 'numeric' as const, numericFormat: {
      pattern: '0,0 ₺',
      culture: 'tr-TR'
    }}
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Departman Maaş Tabloları</h1>
      <Table
        blocks={blocks}
        columns={columns}
        blockClassName="bg-white shadow-lg rounded-xl overflow-hidden"
        blockHeaderClassName="text-xl text-blue-600 font-semibold bg-gray-100 p-4 text-center border border-[#CCC] border-b-0"
        height="auto"
        onDataChange={(changes) => {
          if (!changes) return;
          console.log('Değişiklikler:', changes);
        }}
        readOnly={false}
        rowHeaders={true}
        colHeaders={true}
        filters={true}
        dropdownMenu={true}
        contextMenu={true}
        multiColumnSorting={true}
        manualColumnResize={true}
      />
    </div>
  );
} 