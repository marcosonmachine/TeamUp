"use client";

import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { ProjectCard } from './ProjectCard';

import { useAuthContext } from '@/providers/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { FaSortAlphaDown, FaSortNumericDown } from 'react-icons/fa';

interface ProjectListClientProps {
  projects: Project[];
}

export default function ProjectListClient({ projects }: ProjectListClientProps) {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');

  const { user } = useAuthContext();

  useEffect(() => {
    if (projects.length > 0) {
      setLoading(false);
    }
  }, [projects]);


  const filteredProjects = projects
    .filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'date') {
        return a.createdAt - b.createdAt;
      }
      return 0;
    });

  if (loading) {
    return <div>No Projects For Now</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <Input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:max-w-sm border border-gray-300 rounded-lg"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button className="mt-4 md:mt-0 md:ml-4 border border-gray-300 rounded-lg">
          Sort by: {sortOption === 'name' ? 'Name' : 'Date'}
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setSortOption('name')}>
          <FaSortAlphaDown className="mr-2" /> Name
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSortOption('date')}>
          <FaSortNumericDown className="mr-2" /> Date
        </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
      <hr className="my-4" />
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} user={user} />
      ))}
      </div>
    </div>
  );
}