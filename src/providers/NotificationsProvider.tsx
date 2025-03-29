import { ReactNode } from 'react';
import { Toaster } from 'sonner';

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
} 