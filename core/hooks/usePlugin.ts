import { usePluginStore } from "../pluginStore";

export function usePlugin(pluginId: string) {
    const plugin = usePluginStore((state) => state.getPlugin(pluginId));
    const isActive = usePluginStore((state) => 
      state.activePlugins.includes(pluginId)
    );
    const enablePlugin = usePluginStore((state) => state.enablePlugin);
    const disablePlugin = usePluginStore((state) => state.disablePlugin);
    const updateSettings = usePluginStore((state) => state.updatePluginSettings);
  
    return {
      plugin,
      isActive,
      enable: () => enablePlugin(pluginId),
      disable: () => disablePlugin(pluginId),
      updateSettings: (settings: Record<string, any>) => 
        updateSettings(pluginId, settings)
    };
  }