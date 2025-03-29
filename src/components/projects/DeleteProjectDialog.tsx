import { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';

interface DeleteProjectDialogProps {
  project: Project;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteProjectDialog({ project, onClose, onDelete }: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const projectRef = doc(db, 'projects', project.id);
    await deleteDoc(projectRef);
    setIsDeleting(false);
    onDelete();
    onClose();
  };

  return (
    <div className="delete-project-dialog fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Confirm Deletion</h2>
        <p className="text-gray-600 dark:text-gray-300">Are you sure you want to delete the project "{project.name}"?</p>
        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}