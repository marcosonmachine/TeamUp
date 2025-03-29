"use client";
import GreetingsPage from '../components/main/Greetings';
import DashboardPage from '../components/main/Dashboard';
import Setup from '@/components/main/Setup';

import { useAuthContext } from '@/providers/AuthProvider';


export default function HomePage() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (<div className="flex items-center justify-center min-h-screen bg-gray-900"><h1>Loading...</h1></div>);
  }

  if (!user) {
    return (<GreetingsPage />);
  }

  if (user?.displayName == '' || user?.displayName == null || user?.photoURL == '' || user?.photoURL == null) {
    return (<Setup />);
  }

  return (<DashboardPage />);
}
