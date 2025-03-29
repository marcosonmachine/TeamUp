"use client";

import { useState, FormEvent } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createJoinRequest } from '@/lib/firestore';
import type { Team } from '@/types';

interface JoinRequestDialogProps {
  team: Team;
  projectId: string;
}

export function JoinRequestDialog({ team, projectId }: JoinRequestDialogProps) {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createJoinRequest({
        userId: user.uid,
        teamId: team.id,
        projectId,
        message,
      });

      setOpen(false);
      setMessage('');
    } catch (error) {
      console.error('Error creating join request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Request to Join
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join Request</DialogTitle>
            <DialogDescription>
              Send a request to join {team.name}. You can include a message to the team leader.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the team leader why you'd like to join..."
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 