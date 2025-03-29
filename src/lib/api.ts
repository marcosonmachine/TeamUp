import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { Project } from '@/types';

export async function fetchProjects(): Promise<Project[]> {
  const projectsCollection = collection(db, 'projects');
  const projectSnapshot = await getDocs(projectsCollection);
  const projects = projectSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Project[];
  return projects;
} 