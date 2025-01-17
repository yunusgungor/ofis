import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SettingsStore {
  settings: Record<string, any>;
  updateSettings: (key: string, value: any) => void;
  getSettings: (key: string) => any;
}

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set, get) => ({
        settings: {},
        
        updateSettings: (key: string, value: any) => {
          set((state) => ({
            settings: {
              ...state.settings,
              [key]: value
            }
          }));
        },

        getSettings: (key: string) => {
          return get().settings[key];
        }
      }),
      {
        name: 'settings-storage'
      }
    )
  )
);