import { Suspense } from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ActivityList } from '@/components/profile/ActivityList';

export default function ProfilePage() {
  return (
    <main className="container mx-auto py-8 px-6 bg-gray-50 shadow-lg rounded-lg">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-4xl font-extrabold text-gray-800">Your Profile</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <ProfileHeader />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <ProfileForm />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <Suspense fallback={<div>Loading activity...</div>}>
            <ActivityList />
          </Suspense>
        </div>
      </div>
    </main>
  );
} 