"use client";

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { subscribeToUserInvitations, updateInvitation } from '@/lib/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import type { Invitation, Team, User } from '@/types';
import { getDoc, doc } from 'firebase/firestore';

interface InvitationsManagerClientProps {
  projectId: string;
}

export function InvitationsManagerClient({ projectId }: InvitationsManagerClientProps) {
  const { user: currentUser } = useAuthContext();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserInvitations(currentUser.uid, async (newInvitations) => {
      setInvitations(newInvitations);

      // Load team and user data for each invitation
      const teamPromises = newInvitations.map(invitation => getDoc(doc(db, 'teams', invitation.teamId)));
      const userPromises = newInvitations.map(invitation => getDoc(doc(db, 'users', invitation.userId)));

      const teamsData = await Promise.all(teamPromises);
      const usersData = await Promise.all(userPromises);

      const teamsMap = newInvitations.reduce((acc, invitation, index) => {
        if (teamsData[index].exists()) {
          acc[invitation.teamId] = { id: teamsData[index].id, ...teamsData[index].data() } as Team;
        }
        return acc;
      }, {} as Record<string, Team>);

      const usersMap = newInvitations.reduce((acc, invitation, index) => {
        if (usersData[index].exists()) {
          acc[invitation.userId] = { id: usersData[index].id, ...usersData[index].data() } as User;
        }
        return acc;
      }, {} as Record<string, User>);

      setTeams(teamsMap);
      setUsers(usersMap);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleInvitationAction = async (invitation: Invitation, action: 'accepted' | 'rejected') => {
    try {
      await updateInvitation(invitation.id, action);

      toast(`Invitation ${action}`, {
        description: `The invitation to join ${teams[invitation.teamId]?.name} has been ${action}.`,
      });
    } catch (error) {
      console.error(`Error ${action} invitation:`, error);
      toast('Error', {
        description: `Failed to ${action} invitation. Please try again.`,
      });
    }
  };

  if (loading) {
    return <div>Loading invitations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.length === 0 ? (
            <p className="text-sm text-gray-500">No pending invitations.</p>
          ) : (
            invitations.map((invitation) => {
              const team = teams[invitation.teamId];
              const user = users[invitation.userId];
              if (!team || !user) return null;

              return (
                <div key={invitation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>
                          {user.displayName?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {invitation.message && (
                          <p className="text-sm text-gray-500 mt-1">
                            Message: {invitation.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInvitationAction(invitation, 'rejected')}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleInvitationAction(invitation, 'accepted')}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
} 