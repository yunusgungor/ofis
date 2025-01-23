import "./App.css";

import { PluginProvider } from "@core/providers/PluginProvider";
import { PluginRenderer } from "@core/components/PluginRenderer";

import { TablePlugin } from "@plugins/table";
import { FlowPlugin } from "@plugins/flow";

function App() {
  return (
    <PluginProvider>
      <PluginRenderer pluginId={FlowPlugin.id} />
    </PluginProvider>
  );
}

export default App;
