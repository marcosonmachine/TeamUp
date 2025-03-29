import { Suspense } from 'react';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import TeamList from '@/components/projects/TeamList';
import UnteamedUsersList  from '@/components/projects/UnteamedUsersList';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {

  return (
    <main className="container mx-auto py-6 px-4">
      <p>FIX THE CREATE PROJECT FIRST</p>
      <p>AUTH DIRECTLY GET USER DATA</p>
      <p>INITIALIZE DATA WHEN USER GETS IN, PROJECT and PLATFORM BOTH</p>
      <div className="flex flex-col space-y-6">
        <Suspense fallback={<div>Loading project details...</div>}>
          <ProjectHeader projectId={params.id} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<div>Loading teams...</div>}>
              <TeamList projectId={params.id} />
            </Suspense>
          </div>
          
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Loading users...</div>}>
              <UnteamedUsersList projectId={params.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
} 