import { Plugin } from '@core/types';
import { PersonList } from './components/PersonList';

export const JobManagerPlugin: Plugin = {
  id: 'job-manager',
  name: 'İş Yönetimi',
  description: 'Personel, grup ve iş yönetimi eklentisi',
  version: '1.0.0',
  component: PersonList,
  enabled: true,
  settings: {
    defaultView: 'personnel',
    showCompleted: true
  }
};