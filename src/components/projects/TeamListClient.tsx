"use client";

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getProjectTeams, getUser } from '@/lib/firestore';
import type { Team, User } from '@/types';
import { JoinRequestDialog } from './JoinRequestDialog';
import { JoinRequestsManagerClient } from './JoinRequestsManagerClient';
import { UnteamedUsersListClient } from './UnteamedUsersListClient';
import { InvitationsManagerClient } from './InvitationsManagerClient';
import { SentInvitationsManagerClient } from './SentInvitationsManagerClient';

interface TeamListClientProps {
  projectId: string;
}

export function TeamListClient({ projectId }: TeamListClientProps) {
  const { user } = useAuthContext();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamLeaders, setTeamLeaders] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        const teamsData = await getProjectTeams(projectId);
        setTeams(teamsData);

        // Load team leaders
        const leaderPromises = teamsData.map(team => getUser(team.leaderId));
        const leaders = await Promise.all(leaderPromises);
        const leadersMap = teamsData.reduce((acc, team, index) => {
          if (leaders[index]) {
            acc[team.id] = leaders[index]!;
          }
          return acc;
        }, {} as Record<string, User>);
        
        setTeamLeaders(leadersMap);
      } catch (error) {
        console.error('Error loading teams:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [projectId]);

  if (loading) {
    return <div>Loading teams...</div>;
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No teams found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Teams</h2>
        <div className="grid grid-cols-1 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription className="mt-2">{team.description}</CardDescription>
                    </div>
                    <div className="text-sm text-gray-500">
                      {team.members.length} / {team.maxSize} members
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Leader: {teamLeaders[team.id]?.displayName || 'Loading...'}
                    </div>
                    {user && !team.members.includes(user.uid) && team.members.length < team.maxSize && (
                      <JoinRequestDialog team={team} projectId={projectId} />
                    )}
                  </div>
                </CardContent>
              </Card>
              {user && team.leaderId === user.uid && (
                <div className="space-y-4">
                  <JoinRequestsManagerClient team={team} />
                  <SentInvitationsManagerClient teamId={team.id} />
                  <UnteamedUsersListClient
                    projectId={projectId}
                    team={team}
                    isTeamLeader={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {user && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Invitations</h2>
          <InvitationsManagerClient projectId={projectId} />
        </div>
      )}
    </div>
  );
} 