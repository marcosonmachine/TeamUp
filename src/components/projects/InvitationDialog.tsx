"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInvitation } from '@/lib/firestore';
import { toast } from 'sonner';
import type { Team, User } from '@/types';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface InvitationDialogProps {
  team: Team;
  onClose: () => void;
}

export default function InvitationDialog({ team, onClose }: InvitationDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('currentTeamId', '==', null));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersData);
    };

    loadUsers();
  }, []);

  const handleInvite = async () => {
    if (!selectedUser) return;
    await createInvitation({
      teamId: team.id,
      userId: selectedUser,
      projectId: team.projectId,
      inviterId: team.leaderId,
      message
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => { e.preventDefault(); handleInvite(); }}>
          <DialogHeader>
            <DialogTitle>Invite User to {team.name}</DialogTitle>
            <DialogDescription>
              Select a user and add an invitation message.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user">Select User</Label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName || user.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Invitation Message</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Send Invitation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 