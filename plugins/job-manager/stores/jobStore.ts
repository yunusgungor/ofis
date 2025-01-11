import { create } from "zustand";
import { Job } from "../models/Job";
import { invoke } from "@tauri-apps/api/core";

interface JobStore {
  jobs: Job[];
  loading: boolean;
  fetchJobs: () => Promise<void>;
  createJob: (newJob: Job) => Promise<void>;
  updateJob: (jobId: number, newJob: Job) => Promise<void>;
  deleteJob: (jobId: number) => Promise<void>;
}

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  loading: false,
  fetchJobs: async (groupId?: number, personId?: number) => {
    try {
      set({ loading: true });
      let jobs;
      
      if (groupId) {
        jobs = await invoke<Job[]>('fetch_group_jobs', { groupId });
      } else if (personId) {
        jobs = await invoke<Job[]>('fetch_person_jobs', { personId }); 
      } else {
        jobs = await invoke<Job[]>('fetch_all_jobs');
      }

      set({ jobs, loading: false });
    } catch (error) {
      console.error('İşler getirilirken hata oluştu:', error);
      set({ loading: false });
    }
  },
  createJob: async (newJob: Job) => {
    try {
      set({ loading: true });
      await invoke('create_job', { job: newJob });
      const jobs = await invoke<Job[]>('fetch_all_jobs');
      set({ jobs, loading: false });
    } catch (error) {
      console.error('İş oluşturulurken hata oluştu:', error);
      set({ loading: false });
    }
  },
  updateJob: async (jobId: number, newJob: Job) => {
    try {
      set({ loading: true });
      await invoke('update_job', { jobId, job: newJob });
      const jobs = await invoke<Job[]>('fetch_all_jobs');
      set({ jobs, loading: false });
    } catch (error) {
      console.error('İş güncellenirken hata oluştu:', error);
      set({ loading: false });
    }
  },
  deleteJob: async (jobId: number) => {
    try {
      set({ loading: true });
      await invoke('delete_job', { jobId });
      const jobs = await invoke<Job[]>('fetch_all_jobs');
      set({ jobs, loading: false });
    } catch (error) {
      console.error('İş silinirken hata oluştu:', error);
      set({ loading: false });
    }
  }
}));