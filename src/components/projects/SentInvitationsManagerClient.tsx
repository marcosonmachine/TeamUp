"use client";

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import type { Invitation, User } from '@/types';

interface SentInvitationsManagerClientProps {
  teamId: string;
}

export function SentInvitationsManagerClient({ teamId }: SentInvitationsManagerClientProps) {
  const { user: currentUser } = useAuthContext();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'invitations'),
      where('teamId', '==', teamId),
      where('inviterId', '==', currentUser.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const invitationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invitation[];

      setInvitations(invitationsData);

      // Fetch user data for each invitation
      const userIds = new Set(invitationsData.map(invite => invite.userId));
      const usersData: Record<string, User> = {};

      for (const userId of userIds) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          usersData[userId] = { id: userDoc.id, ...userDoc.data() } as User;
        }
      }

      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, teamId]);

  const handleCancelInvitation = async (invitation: Invitation) => {
    try {
      await updateDoc(doc(db, 'invitations', invitation.id), {
        status: 'cancelled',
      });

      toast('Invitation Cancelled', {
        description: `The invitation to ${users[invitation.userId]?.displayName} has been cancelled.`,
      });
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast('Error', {
        description: 'Failed to cancel invitation. Please try again.',
      });
    }
  };

  if (loading) {
    return <div>Loading sent invitations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sent Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.length === 0 ? (
            <p className="text-sm text-gray-500">No pending invitations sent.</p>
          ) : (
            invitations.map((invitation) => {
              const invitedUser = users[invitation.userId];
              if (!invitedUser) return null;

              return (
                <div key={invitation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={invitedUser.photoURL} />
                        <AvatarFallback>
                          {invitedUser.displayName?.charAt(0) || invitedUser.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{invitedUser.displayName}</p>
                        <p className="text-sm text-gray-500">{invitedUser.email}</p>
                        {invitation.message && (
                          <p className="text-sm text-gray-500 mt-1">
                            Message: {invitation.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelInvitation(invitation)}
                    >
                      Cancel
                    </Button>
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