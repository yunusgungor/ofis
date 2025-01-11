import { usePlugin } from "../hooks/usePlugin";

interface PluginRendererProps {
  pluginId: string;
}

export function PluginRenderer({ pluginId }: PluginRendererProps) {
  const { plugin, isActive } = usePlugin(pluginId);
  
  console.log("PluginRenderer:", {
    pluginId,
    plugin,
    isActive
  });

  if (!plugin || !isActive) {
    console.log("Plugin aktif değil veya bulunamadı");
    return null;
  }

  const PluginComponent = plugin.component;
  return PluginComponent ? <PluginComponent /> : null;
}