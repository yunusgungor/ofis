import { Person } from "./Person";

interface Group {
  id: number;
  name: string;
  description: string;
  persons: Person[];
}

export type { Group };  