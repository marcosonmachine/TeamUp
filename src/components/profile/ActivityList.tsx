import React, { useEffect, useState } from 'react';
import { getActivities } from '@/lib/firestore';

interface Activity {
  id: string;
  description: string;
  date: string;
}

export const ActivityList: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const activitiesData = await getActivities();
      setActivities(activitiesData);
    };

    fetchActivities();
  }, []);

  return (
    <ul className="space-y-4">
      {activities.map(activity => (
        <li key={activity.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
          <span className="text-gray-800">{activity.description}</span>
          <span className="text-gray-500 text-sm">{activity.date}</span>
        </li>
      ))}
    </ul>
  );
};

export default ActivityList; 