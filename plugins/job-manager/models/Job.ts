interface Job {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

interface groupJob extends Job {
  groupId: number;
}

interface personJob extends Job {
  personId: number;
}

export type { Job, groupJob, personJob };    