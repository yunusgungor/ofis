import { Plugin } from '@core/types';
import { OrnekBlockTablo } from './components/OrnekBlockTablo';

export const TablePlugin: Plugin = {
  id: 'table',
  name: 'Tablo Arayüzü',
  description: 'Tablo eklentisi',
  version: '1.0.0',
  component: OrnekBlockTablo,
  enabled: true,
  settings: {
    defaultView: 'table',
  }
};