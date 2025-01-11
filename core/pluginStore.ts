import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Plugin } from './types';

interface PluginStore {
  plugins: Map<string, Plugin>;
  activePlugins: string[];
  
  // Plugin Yönetimi
  registerPlugin: (plugin: Plugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  enablePlugin: (pluginId: string) => void;
  disablePlugin: (pluginId: string) => void;
  
  // Plugin Durumu
  getPlugin: (pluginId: string) => Plugin | undefined;
  getAllPlugins: () => Plugin[];
  getActivePlugins: () => Plugin[];
  
  // Plugin Ayarları
  updatePluginSettings: (pluginId: string, settings: Record<string, any>) => void;
}

export const usePluginStore = create<PluginStore>()(
  devtools(
    persist(
      (set, get) => ({
        plugins: new Map(),
        activePlugins: [],

        registerPlugin: (plugin: Plugin) => {
          set((state) => {
            const newPlugins = new Map(state.plugins);
            newPlugins.set(plugin.id, plugin);
            return { plugins: newPlugins };
          });
        },

        unregisterPlugin: (pluginId: string) => {
          set((state) => {
            const newPlugins = new Map(state.plugins);
            newPlugins.delete(pluginId);
            return { 
              plugins: newPlugins,
              activePlugins: state.activePlugins.filter(id => id !== pluginId)
            };
          });
        },

        enablePlugin: (pluginId: string) => {
          set((state) => ({
            activePlugins: [...state.activePlugins, pluginId]
          }));
        },

        disablePlugin: (pluginId: string) => {
          set((state) => ({
            activePlugins: state.activePlugins.filter(id => id !== pluginId)
          }));
        },

        getPlugin: (pluginId: string) => {
          return get().plugins.get(pluginId);
        },

        getAllPlugins: () => {
          return Array.from(get().plugins.values());
        },

        getActivePlugins: () => {
          const { plugins, activePlugins } = get();
          return activePlugins
            .map(id => plugins.get(id))
            .filter((plugin): plugin is Plugin => plugin !== undefined);
        },

        updatePluginSettings: (pluginId: string, settings: Record<string, any>) => {
          set((state) => {
            const plugin = state.plugins.get(pluginId);
            if (!plugin) return state;

            const updatedPlugin = {
              ...plugin,
              settings: { ...plugin.settings, ...settings }
            };

            const newPlugins = new Map(state.plugins);
            newPlugins.set(pluginId, updatedPlugin);

            return { plugins: newPlugins };
          });
        },
      }),
      {
        name: 'plugin-storage',
        partialize: (state) => ({
          activePlugins: state.activePlugins,
          plugins: Array.from(state.plugins.entries())
        }),
        merge: (persistedState: any, currentState) => ({
          ...currentState,
          activePlugins: persistedState.activePlugins,
          plugins: new Map(persistedState.plugins)
        })
      }
    )
  )
);