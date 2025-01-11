import { Plugin } from '@core/types';
import {PersonList} from '@plugins/table/components/PersonList';

export const TablePlugin: Plugin = {
  id: 'table',
  name: 'Tablo Arayüzü',
  description: 'Tablo eklentisi',
  version: '1.0.0',
  component: PersonList,
  enabled: true,
  settings: {
    defaultView: 'table',
  }
};