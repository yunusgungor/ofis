export interface Personnel {
    id: string;
    name: string;
    email: string;
    role: string;
    groups: string[];
    jobs: string[];
}
  
export interface Group {
    id: string;
    name: string;
    description?: string;
    members: string[];
    jobs: string[];
}
  
export interface Job {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    assignedTo: {
        type: 'personnel' | 'group';
        id: string;
    }[];
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
}