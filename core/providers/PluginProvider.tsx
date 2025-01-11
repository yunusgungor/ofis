import { createContext, useContext, ReactNode } from 'react';
import { usePluginStore } from '../pluginStore';
import { Plugin } from '../types';

interface PluginContextType {
  plugins: Map<string, Plugin>;
  activePlugins: string[];
  registerPlugin: (plugin: Plugin) => void;
  enablePlugin: (pluginId: string) => void;
}

const PluginContext = createContext<PluginContextType | null>(null);

export function PluginProvider({ children }: { children: ReactNode }) {
  const store = usePluginStore();

  return (
    <PluginContext.Provider value={store}>
      {children}
    </PluginContext.Provider>
  );
}

export const usePluginContext = () => {
  const context = useContext(PluginContext);
  if (!context) throw new Error('usePluginContext must be used within PluginProvider');
  return context;
}; 