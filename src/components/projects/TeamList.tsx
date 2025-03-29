"use client";
import { useEffect, useState } from 'react';
import { getProjectTeams } from '@/lib/firestore';
import type { Team } from '@/types';
import { Card } from '@/components/ui/card';
import CreateTeamDialog from './CreateTeamDialog';
import { useAuthContext } from '@/providers/AuthProvider';

interface TeamListProps {
  projectId: string;
}

export default function TeamList({ projectId }: TeamListProps) {
  const { user } = useAuthContext();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function loadTeams() {
      try {
        const teamsData = await getProjectTeams(projectId);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [projectId, refresh]);

  // TODO: Skeleton loader 
  if (loading) {
    return <div>Loading teams...</div>;
  }


  return (
    <div className='space-y-4'>
      <div className="flex items-center ">
        {!teams.find(team => team.members.find((member: string) => member == user?.uid) != undefined ) &&
          <CreateTeamDialog projectId={projectId} setRefresh={setRefresh} />
        }
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <Card key={team.teamId} className="p-6 dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">Members: {team.members.length}</p>
          </Card>
        ))}
      </div>

    </div>
  );
} 