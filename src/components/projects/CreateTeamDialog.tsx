import { useState, ChangeEvent, FormEvent } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogHeader, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/providers/AuthProvider';
import { createTeam } from '@/lib/firestore';

interface CreateTeamDialogProps {
  projectId: string;
  setRefresh: (value: number) => void;
}

export default function CreateTeamDialog({ projectId, setRefresh }: CreateTeamDialogProps) {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createTeam({
        projectId,
        name: formData.name,
        members: [user.uid],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setOpen(false);
      setFormData({ name: '' });
      // LMAO works
      setRefresh(Math.random()*100);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' >Add Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-200">Create a New Team</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Create a new team for the project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-800 dark:text-gray-200">Team Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-200" disabled={!formData.name}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}