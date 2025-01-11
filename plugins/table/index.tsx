import { Plugin } from '@core/types';
import { TestTabel } from './components/TestTabel';

export const TablePlugin: Plugin = {
  id: 'table',
  name: 'Tablo Arayüzü',
  description: 'Tablo eklentisi',
  version: '1.0.0',
  component: TestTabel,
  enabled: true,
  settings: {
    defaultView: 'table',
  }
};