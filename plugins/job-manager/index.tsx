import { Plugin } from '@core/types';
import { JobManagerDashboard } from '@plugins/job-manager/components/JobManagerDashboard';

export const JobManagerPlugin: Plugin = {
  id: 'job-manager',
  name: 'İş Yönetimi',
  description: 'Personel, grup ve iş yönetimi eklentisi',
  version: '1.0.0',
  component: JobManagerDashboard,
  enabled: true,
  settings: {
    defaultView: 'personnel',
    showCompleted: true
  }
};