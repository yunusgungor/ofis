export interface Plugin {
    id: string;
    name: string;
    description?: string;
    version: string;
    component: React.ComponentType<any>;
    icon?: React.ComponentType;
    settings?: Record<string, any>;
    dependencies?: string[];
    enabled: boolean;
  }
  
  export interface CoreState {
    plugins: Map<string, Plugin>;
    activePlugins: string[];
    settings: Record<string, any>;
  }