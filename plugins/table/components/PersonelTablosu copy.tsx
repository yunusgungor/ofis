import { Table } from '@plugins/table/components/Table';
import { useState, useRef, useEffect } from 'react';

interface Bolum {
  id: string;
  baslik: string;
  aciklama: string;
  personeller: Personel[];
}

interface Personel {
  id: number;
  ad: string;
  soyad: string;
  departman: string;
  unvan: string;
  iseGirisTarihi: string;
}

export function PersonelTablosu() {
  const [aktifBolum, setAktifBolum] = useState<string | null>(null);
  const bolumRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const bolumler: Bolum[] = [
    {
      id: 'bolum1',
      baslik: 'Yazılım Ekibi',
      aciklama: 'Yazılım geliştirme departmanı personel listesi',
      personeller: [
        { 
          id: 1, 
          ad: 'Ahmet', 
          soyad: 'Yılmaz', 
          departman: 'Bilgi İşlem',
          unvan: 'Yazılım Geliştirici',
          iseGirisTarihi: '2023-01-15'
        },
        // ... diğer personeller
      ]
    },
    {
      id: 'bolum2',
      baslik: 'İK Ekibi',
      aciklama: 'İnsan kaynakları departmanı personel listesi',
      personeller: [
        { 
          id: 2, 
          ad: 'Ayşe', 
          soyad: 'Demir', 
          departman: 'İnsan Kaynakları',
          unvan: 'İK Uzmanı',
          iseGirisTarihi: '2022-06-20'
        },
        // ... diğer personeller
      ]
    }
  ];

  const handleBolumClick = (bolumId: string) => {
    setAktifBolum(bolumId);
    bolumRefs.current[bolumId]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAktifBolum(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(bolumRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const columns = [
    { 
      data: 'id', 
      title: 'ID',
      readOnly: true,
      type: 'numeric' as const
    },
    { 
      data: 'ad', 
      title: 'Ad'
    },
    { 
      data: 'soyad', 
      title: 'Soyad'
    },
    { 
      data: 'departman', 
      title: 'Departman',
      type: 'dropdown' as const,
      source: ['Bilgi İşlem', 'İnsan Kaynakları', 'Muhasebe', 'Satış', 'Pazarlama']
    },
    { 
      data: 'unvan', 
      title: 'Ünvan'
    },
    { 
      data: 'iseGirisTarihi', 
      title: 'İşe Giriş Tarihi',
      type: 'date' as const
    }
  ];

  return (
    <div className="grid grid-cols-[250px,1fr] gap-4 h-screen">
      {/* Sol Sidebar */}
      <div className="sticky top-0 h-screen overflow-y-auto p-4 bg-gray-50">
        <h2 className="text-lg font-bold mb-4">Bölümler</h2>
        {bolumler.map((bolum) => (
          <button
            key={bolum.id}
            onClick={() => handleBolumClick(bolum.id)}
            className={`w-full text-left p-2 mb-2 rounded ${
              aktifBolum === bolum.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {bolum.baslik}
          </button>
        ))}
      </div>

      {/* Ana İçerik */}
      <div className="overflow-y-auto p-4">
        {bolumler.map((bolum) => (
          <div
            key={bolum.id}
            id={bolum.id}
            ref={(el) => (bolumRefs.current[bolum.id] = el)}
            className={`mb-8 p-4 rounded-lg border ${
              aktifBolum === bolum.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
            }`}
          >
            <h2 className="text-2xl font-bold mb-2">{bolum.baslik}</h2>
            <p className="text-gray-600 mb-4">{bolum.aciklama}</p>
            <Table
              data={bolum.personeller}
              columns={columns}
              width="100%"
              height={400}
              onDataChange={(changes) => {
                if (!changes) return;
                console.log(`${bolum.baslik} - Değişiklikler:`, changes);
              }}
              readOnly={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}