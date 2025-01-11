import { create } from "zustand";
import { Person } from "../models/Person";
import { invoke } from "@tauri-apps/api/core";

interface PersonStore {
  persons: Person[];
  loading: boolean;
  fetchPersons: () => Promise<void>;
  fetchGroupPersons: (groupId: number) => Promise<void>;
  createPerson: (newPerson: Person) => Promise<void>;
  updatePerson: (personId: number, newPerson: Person) => Promise<void>;
  deletePerson: (personId: number) => Promise<void>;
}

export const usePersonStore = create<PersonStore>((set) => ({
  persons: [],
  loading: false,

  fetchPersons: async () => {
    try {
      set({ loading: true });
      const persons = await invoke<Person[]>('fetch_all_persons');
      set({ persons, loading: false });
    } catch (error) {
      console.error('Personel listesi getirilirken hata oluştu:', error);
      set({ loading: false });
    }
  },

  fetchGroupPersons: async (groupId: number) => {
    try {
      set({ loading: true });
      const persons = await invoke<Person[]>('fetch_group_persons', { groupId });
      set({ persons, loading: false });
    } catch (error) {
      console.error('Grup personel listesi getirilirken hata oluştu:', error);
      set({ loading: false });
    }
  },

  createPerson: async (newPerson: Person) => {
    try {
      set({ loading: true });
      await invoke('create_person', { person: newPerson });
      const persons = await invoke<Person[]>('fetch_all_persons');
      set({ persons, loading: false });
    } catch (error) {
      console.error('Personel oluşturulurken hata oluştu:', error);
      set({ loading: false });
    }
  },

  updatePerson: async (personId: number, newPerson: Person) => {
    try {
      set({ loading: true });
      await invoke('update_person', { personId, person: newPerson });
      const persons = await invoke<Person[]>('fetch_all_persons');
      set({ persons, loading: false });
    } catch (error) {
      console.error('Personel güncellenirken hata oluştu:', error);
      set({ loading: false });
    }
  },

  deletePerson: async (personId: number) => {
    try {
      set({ loading: true });
      await invoke('delete_person', { personId });
      const persons = await invoke<Person[]>('fetch_all_persons');
      set({ persons, loading: false });
    } catch (error) {
      console.error('Personel silinirken hata oluştu:', error);
      set({ loading: false });
    }
  }
}));
