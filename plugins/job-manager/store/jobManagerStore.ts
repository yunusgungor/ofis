import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Personnel, Job, Group } from '../types';

interface JobManagerState {
  personnel: Personnel[];
  groups: Group[];
  jobs: Job[];
  
  // Personnel Actions
  addPersonnel: (person: Omit<Personnel, 'id'>) => void;
  removePersonnel: (id: string) => void;
  updatePersonnel: (id: string, updates: Partial<Personnel>) => void;
  
  // Group Actions
  addGroup: (group: Omit<Group, 'id'>) => void;
  removeGroup: (id: string) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  addPersonnelToGroup: (groupId: string, personnelId: string) => void;
  removePersonnelFromGroup: (groupId: string, personnelId: string) => void;
  
  // Job Actions
  addJob: (job: Omit<Job, 'id'>) => void;
  removeJob: (id: string) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  assignJob: (jobId: string, assignee: { type: 'personnel' | 'group'; id: string }) => void;
  unassignJob: (jobId: string, assigneeId: string) => void;
}

export const useJobManagerStore = create<JobManagerState>()(
  devtools(
    persist(
      (set) => ({
        personnel: [],
        groups: [],
        jobs: [],
        
        addPersonnel: (person) => set((state) => ({
          personnel: [...state.personnel, { ...person, id: crypto.randomUUID() }]
        })),
        
        removePersonnel: (id) => set((state) => ({
          personnel: state.personnel.filter(p => p.id !== id)
        })),
        
        updatePersonnel: (id, updates) => set((state) => ({
          personnel: state.personnel.map(p => p.id === id ? { ...p, ...updates } : p)
        })),

        addGroup: (group) => set((state) => ({
          groups: [...state.groups, { ...group, id: crypto.randomUUID() }]
        })),

        removeGroup: (id) => set((state) => ({
          groups: state.groups.filter(g => g.id !== id)
        })),

        updateGroup: (id, updates) => set((state) => ({
          groups: state.groups.map(g => g.id === id ? { ...g, ...updates } : g)
        })),

        addPersonnelToGroup: (groupId, personnelId) => set((state) => ({
          groups: state.groups.map(g => g.id === groupId ? { ...g, members: [...g.members, personnelId] } : g)
        })),

        removePersonnelFromGroup: (groupId, personnelId) => set((state) => ({
          groups: state.groups.map(g => g.id === groupId ? { ...g, members: g.members.filter(id => id !== personnelId) } : g)
        })),

        addJob: (job) => set((state) => ({
          jobs: [...state.jobs, { ...job, id: crypto.randomUUID() }]
        })),

        removeJob: (id) => set((state) => ({
          jobs: state.jobs.filter(j => j.id !== id)
        })),

        updateJob: (id, updates) => set((state) => ({
          jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
        })),

        assignJob: (jobId, assignee) => set((state) => ({
          jobs: state.jobs.map(j => j.id === jobId ? { ...j, assignee } : j)
        })),

        unassignJob: (jobId) => set((state) => ({
          jobs: state.jobs.map(j => j.id === jobId ? { ...j, assignee: undefined } : j)
        }))
      }),
      {
        name: 'job-manager-storage'
      }
    )
  )
);