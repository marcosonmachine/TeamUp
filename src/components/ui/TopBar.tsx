"use client";
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

import { useAuthContext } from '@/providers/AuthProvider';
import { LoginButton } from "@/components/auth/LoginButton";
import { Button } from './button';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

export function TopBar() {
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const toggleDarkMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };



  return (
    <div className='flex items-center justify-between m-4 p-4 shadow-lg rounded-lg bg-white shadow-gray-300 dark:bg-gray-800 dark:shadow-gray-900'>
      <h1 className="text-3xl font-bold">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-700">Team</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500">Up</span>
      </h1>
      <div className="flex items-center justify-between gap-4">

        <Button
          onClick={toggleDarkMode}
          className='p-2 rounded-full focus:outline-none transition-colors duration-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 '
        >
          <span className='flex flex-row items-center gap-2'><FaSun className="text-yellow-500" />:<FaMoon className="text-gray-800" /></span>
        </Button>

        <Avatar>
          <AvatarImage src={user?.photoURL ?? ''} alt="@userAvatar" />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>


        <LoginButton />
      </div>
    </div>
  );
} 