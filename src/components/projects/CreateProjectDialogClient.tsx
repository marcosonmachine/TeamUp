"use client";

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
import { Label } from "@/components/ui/label";
import { createProject } from '@/lib/firestore';

interface CreateProjectDialogClientProps {
  projectId: string;
}

export default function CreateProjectDialogClient({ projectId }: CreateProjectDialogClientProps) {
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxTeamSize: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createProject({
        name: formData.name,
        description: formData.description,
        maxTeamSize: formData.maxTeamSize ? parseInt(formData.maxTeamSize) : undefined,
        ownerId: user.uid,
        status: 'active',
      });

      setOpen(false);
      setFormData({ name: '', description: '', maxTeamSize: '' });
    } catch (error) {
      console.error('Error creating project:', error);
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
        <Button className="bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-200">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-200">Create Project</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Create a new project to start forming teams.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-800 dark:text-gray-200">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-800 dark:text-gray-200">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxTeamSize" className="text-gray-800 dark:text-gray-200">Maximum Team Size (Optional)</Label>
              <Input
                id="maxTeamSize"
                type="number"
                value={formData.maxTeamSize}
                onChange={handleInputChange}
                min="1"
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-500 text-white dark:bg-blue-700 dark:text-gray-200">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 