import "./App.css";

import { PluginProvider } from "@core/providers/PluginProvider";
import { PluginRenderer } from "@core/components/PluginRenderer";

import { TablePlugin } from "@plugins/table";

function App() {
  return (
    <PluginProvider>
      <PluginRenderer pluginId={TablePlugin.id} />
    </PluginProvider>
  );
}

export default App;
