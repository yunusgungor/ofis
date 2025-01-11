import { create } from "zustand";
import { Group } from "../models/Group";
import { invoke } from "@tauri-apps/api/core";

interface GroupStore {
  groups: Group[];
  loading: boolean;
  fetchGroups: () => Promise<void>;
  createGroup: (newGroup: Group) => Promise<void>;
  updateGroup: (groupId: number, newGroup: Group) => Promise<void>;
  deleteGroup: (groupId: number) => Promise<void>;
  addPersonToGroup: (groupId: number, personId: number) => Promise<void>;
  removePersonFromGroup: (groupId: number, personId: number) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  loading: false,

  fetchGroups: async () => {
    try {
      set({ loading: true });
      const groups = await invoke<Group[]>('fetch_all_groups');
      set({ groups, loading: false });
    } catch (error) {
      console.error('Grup listesi getirilirken hata oluştu:', error);
      set({ loading: false });
    }
  },

  createGroup: async (newGroup: Group) => {
    try {
      set({ loading: true });
      await invoke('create_group', { group: newGroup });
      const groups = await invoke<Group[]>('fetch_all_groups');
      set({ groups, loading: false });
    } catch (error) {
      console.error('Grup oluşturulurken hata oluştu:', error);
      set({ loading: false });
    }
  },

  updateGroup: async (groupId: number, newGroup: Group) => {
    try {
      set({ loading: true });
      await invoke('update_group', { groupId, group: newGroup });
      const groups = await invoke<Group[]>('fetch_all_groups');
      set({ groups, loading: false });
    } catch (error) {
      console.error('Grup güncellenirken hata oluştu:', error);
      set({ loading: false });
    }
  },

  deleteGroup: async (groupId: number) => {
    try {
      set({ loading: true });
      await invoke('delete_group', { groupId });
      const groups = await invoke<Group[]>('fetch_all_groups');
      set({ groups, loading: false });
    } catch (error) {
      console.error('Grup silinirken hata oluştu:', error);
      set({ loading: false });
    }
  },

  addPersonToGroup: async (groupId: number, personId: number) => {
    try {
      set({ loading: true });
      await invoke('add_person_to_group', { groupId, personId });
      const groups = await invoke<Group[]>('fetch_all_groups');
      set({ groups, loading: false });
    } catch (error) {
      console.error('Gruba personel eklenirken hata oluştu:', error);
      set({ loading: false });
    }
  },

  removePersonFromGroup: async (groupId: number, personId: number) => {
    try {
      set({ loading: true });
      await invoke('remove_person_from_group', { groupId, personId });
      const groups = await invoke<Group[]>('fetch_all_groups');
      set({ groups, loading: false });
    } catch (error) {
      console.error('Gruptan personel çıkarılırken hata oluştu:', error);
      set({ loading: false });
    }
  }
}));
