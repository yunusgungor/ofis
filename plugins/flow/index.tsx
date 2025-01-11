import { Plugin } from '@core/types';
import { Flow } from '@plugins/flow/components/Flow';

export const FlowPlugin: Plugin = {
  id: 'flow',
  name: 'Flow Arayüzü',
  description: 'Flow eklentisi',
  version: '1.0.0',
  component: Flow,
  enabled: true,
  settings: {
    defaultView: 'flow',
  }
};