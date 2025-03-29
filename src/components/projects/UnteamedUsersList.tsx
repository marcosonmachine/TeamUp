"use client";
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Team, User } from '@/types';
import InvitationDialog from './InvitationDialog';
import { getProjectMembers } from '@/lib/firestore';

interface UnteamedUsersListProps {
  projectId: string;
}
export default function UnteamedUsersList({ projectId }: UnteamedUsersListProps) {
  const { user: currentUser } = useAuthContext();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const projectMembers = await getProjectMembers(projectId);
        setMembers(projectMembers);
      } catch (error) {
        console.error('Error loading unteamed users:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, [projectId]);

  if (loading) {
    return <div>Loading unteamed users...</div>;
  }

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-lg font-semibold">Unteamed Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.length === 0 ? (
            <p className="text-sm text-gray-400">No unteamed users found.</p>
          ) : (
            members.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-900">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    {user.attributes && user.attributes.length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {user.attributes.map((attribute: string, index: number) => (
                          <span key={index} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-300 rounded">
                            {attribute}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {user.teamId ? (
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-300 rounded">Teamed</span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-300 rounded">Unteamed</span>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 