import React, { useEffect, useState } from 'react';
import { usePersonStore } from '../stores/personStore';
import { Person } from '../models/Person';

interface PersonListProps {
  groupId?: number;
}

export const PersonList: React.FC<PersonListProps> = ({ groupId }) => {
  const { persons, loading, fetchPersons, fetchGroupPersons, createPerson, updatePerson, deletePerson } = usePersonStore();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    groupId: groupId || null
  });

  useEffect(() => {
    if (groupId) {
      fetchGroupPersons(groupId);
    } else {
      fetchPersons();
    }
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedPerson) {
      await updatePerson(selectedPerson.id, { ...formData, id: selectedPerson.id });
    } else {
      await createPerson(formData as Person);
    }

    setFormData({ name: '', groupId: groupId || null });
    setIsEditing(false);
    setSelectedPerson(null);
  };

  const handleEdit = (person: Person) => {
    setSelectedPerson(person);
    setFormData({ name: person.name, groupId: person.groupId });
    setIsEditing(true);
  };

  const handleDelete = async (personId: number) => {
    if (window.confirm('Bu personeli silmek istediğinizden emin misiniz?')) {
      await deletePerson(personId);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Personel Adı"
          className="border p-2 rounded"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? 'Güncelle' : 'Ekle'}
        </button>
        {isEditing && (
          <button 
            type="button" 
            onClick={() => {
              setIsEditing(false);
              setSelectedPerson(null);
              setFormData({ name: '', groupId: groupId || null });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            İptal
          </button>
        )}
      </form>

      <div className="space-y-2">
        {persons.map((person) => (
          <div 
            key={person.id} 
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>{person.name}</span>
            <div className="space-x-2">
              <button 
                onClick={() => handleEdit(person)}
                className="text-blue-500"
              >
                Düzenle
              </button>
              <button 
                onClick={() => handleDelete(person.id)}
                className="text-red-500"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
