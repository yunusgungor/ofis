import { usePluginStore } from "../pluginStore";
import { Switch } from "@/components/ui/switch";
import { useMemo } from "react";

export function PluginManager() {
    const plugins = usePluginStore((state) => state.plugins);
    const activePlugins = usePluginStore((state) => state.activePlugins);
    const enablePlugin = usePluginStore((state) => state.enablePlugin);
    const disablePlugin = usePluginStore((state) => state.disablePlugin);
  
    const memoizedPlugins = useMemo(() => Object.values(plugins), [plugins]);
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Plugin Yönetimi</h2>
        {memoizedPlugins.map(plugin => (
          <div key={plugin.id} className="flex items-center space-x-4 mb-2">
            <Switch
              checked={activePlugins.includes(plugin.id)}
              onCheckedChange={(checked) => {
                checked ? enablePlugin(plugin.id) : disablePlugin(plugin.id);
              }}
            />
            <span>{plugin.name}</span>
          </div>
        ))}
      </div>
    );
}