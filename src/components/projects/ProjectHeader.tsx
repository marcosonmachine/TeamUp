"use client";

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { getProject } from '@/lib/firestore';
import { Card } from '../ui/card';

interface ProjectHeaderProps {
  projectId: string;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const { user } = useAuthContext();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const projectData = await getProject(projectId);
        setProject(projectData);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  if (loading) {
    return <div>Loading project details...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const isOwner = user?.uid === project.ownerId;

  return (
    <Card className="p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <div className="flex flex-col space-y-4">
      <div className="flex items-start justify-between">
        <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
        </div>
      
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
        {project.maxTeamSize && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
          Max team size: {project.maxTeamSize}
          </span>
        )}
        </div>
      </div>
      </div>
    </Card>
  );
} 