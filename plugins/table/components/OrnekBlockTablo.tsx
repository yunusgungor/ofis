import { Table } from '@plugins/table/components/Table';
import { useState } from 'react';

interface VeriBlok {
  id: string;
  baslik: string;
  aciklama: React.ReactNode;
  data: {
    id: number;
    ad: string;
    soyad: string;
    departman: string;
    maas: number;
  }[];
}

export function OrnekBlockTablo() {
  const [blocks] = useState<VeriBlok[]>([
    {
      id: 'blok1',
      baslik: 'Yazılım Departmanı',
      aciklama: <span>Yazılım ekibinin maaş tablosu</span>,
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
      aciklama: 'Tasarım ekibinin maaş tablosu',
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
    { 
      data: 'id',
      title: 'ID',
      type: 'numeric' as const,
      readOnly: true
    },
    { data: 'ad', title: 'Ad' },
    { data: 'soyad', title: 'Soyad' },
    { data: 'departman', title: 'Departman' },
    { 
      data: 'maas',
      title: 'Maaş',
      type: 'numeric' as const
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Departman Maaş Tabloları</h1>
      <Table
        blocks={blocks}
        columns={columns}
        width="100%"
        height={400}
        onDataChange={(changes) => {
          if (!changes) return;
          console.log('Değişiklikler:', changes);
        }}
        readOnly={false}
      />
    </div>
  );
} 