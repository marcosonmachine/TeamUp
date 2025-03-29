"use client";

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { subscribeToTeamJoinRequests, updateJoinRequest, getUser, updateTeam, updateUserTeam } from '@/lib/firestore';
import type { JoinRequest, User, Team } from '@/types';
import { db } from '@/lib/firebase';

interface JoinRequestsManagerClientProps {
  team: Team;
}

export function JoinRequestsManagerClient({ team }: JoinRequestsManagerClientProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [requestUsers, setRequestUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTeamJoinRequests(team.id, async (newRequests) => {
      setRequests(newRequests);
      
      // Load user data for each request
      const userPromises = newRequests.map(request => getUser(request.userId));
      const users = await Promise.all(userPromises);
      const usersMap = newRequests.reduce((acc, request, index) => {
        if (users[index]) {
          acc[request.userId] = users[index]!;
        }
        return acc;
      }, {} as Record<string, User>);
      
      setRequestUsers(usersMap);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [team.id]);

  const handleRequestAction = async (request: JoinRequest, action: 'accepted' | 'rejected') => {
    try {
      await updateJoinRequest(request.id, action);

      if (action === 'accepted') {
        // Add user to team members
        const updatedMembers = [...team.members, request.userId];
        await updateTeam(team.id, { members: updatedMembers });
        
        // Update user's current team
        await updateUserTeam(request.userId, team.id);
      }
    } catch (error) {
      console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} request:`, error);
    }
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  if (requests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Requests</CardTitle>
        <CardDescription>
          Manage requests from users who want to join your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => {
            const user = requestUsers[request.userId];
            if (!user) return null;

            return (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                    {request.message && (
                      <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRequestAction(request, 'rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRequestAction(request, 'accepted')}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 