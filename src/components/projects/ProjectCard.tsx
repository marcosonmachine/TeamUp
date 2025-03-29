import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from '@/types';
import { useState } from 'react';

import { FaEdit, FaReact, FaTrash } from 'react-icons/fa';

import EditProjectDialog from './EditProjectDialog';
import DeleteProjectDialog from './DeleteProjectDialog';

interface ProjectCardProps {
  project: Project;
  user: { uid: string } | null;
}

export function ProjectCard({ project: project, user }: ProjectCardProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectForDeletion, setSelectedProjectForDeletion] = useState<Project | null>(null);

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleDeleteClick = (project: Project) => {
    if (project.ownerId === user?.uid) {
      setSelectedProjectForDeletion(project);
    } else {
      alert('Only the creator can delete this project.');
    }
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedProjectForDeletion(null);
  };

  const handleProjectDeleted = () => {
    // Logic to refresh the project list or update state after deletion
  };


  return (
    <Card className="shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:shadow-gray-900 square-box">
      <CardHeader className="bg-gray-100 dark:bg-gray-900 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.name}</CardTitle>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">{project.description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 dark:p-6">
        {project.maxTeamSize && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 dark:mb-4">
            Max team size: {project.maxTeamSize}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col justify-between items-center gap-4">

        <div className="flex w-full gap-2 justify-end">
          <Button
            onClick={() => handleEditClick(project)}
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            <FaEdit />
          </Button>
          <Button
            onClick={() => handleDeleteClick(project)}
            className="text-red-500 dark:text-red-400 hover:underline">
            <FaTrash />
          </Button>
        </div>
        <Link href={`/projects/${project.id}`} className='w-full'>
          <Button className="w-full">View Project</Button>
        </Link>
      </CardFooter>
      {selectedProject && (
        <EditProjectDialog
          project={selectedProject}
          onClose={handleCloseDialog}
        />
      )}
      {selectedProjectForDeletion && (
        <DeleteProjectDialog
          project={selectedProjectForDeletion}
          onClose={handleCloseDeleteDialog}
          onDelete={handleProjectDeleted}
        />
      )}
    </Card>
  );
}