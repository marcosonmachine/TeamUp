import { useState, ChangeEvent, FormEvent } from 'react';
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
import { Input } from "@/components/ui/input";
import { joinProject } from '@/lib/firestore'; // Assume this is a function to join a project

export default function JoinProjectDialogClient() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      await joinProject({
        joinCode,
        userId: user.uid,
      });

      setOpen(false);
      setJoinCode('');
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJoinCode(e.target.value);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 text-white dark:bg-green-700 dark:text-gray-200">Join Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-200">Join Project</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Enter the join code to become part of a project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="joinCode"
                value={joinCode}
                onChange={handleInputChange}
                required
                placeholder="Enter join code"
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-500 text-white dark:bg-green-700 dark:text-gray-200">Join Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 