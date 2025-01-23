import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { usePluginStore } from "@core/pluginStore";
import { TablePlugin } from "@plugins/table";
import { FlowPlugin } from "@plugins/flow";

const initializePlugins = () => {
  const store = usePluginStore.getState();
  store.registerPlugin(TablePlugin);
  store.enablePlugin(TablePlugin.id);
  store.registerPlugin(FlowPlugin);
  store.enablePlugin(FlowPlugin.id);
};

initializePlugins();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
