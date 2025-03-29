import { useAuthContext } from '@/providers/AuthProvider';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function ProfileHeader() {
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.photoURL || undefined} />
            <AvatarFallback className="text-2xl">
              {user.displayName?.charAt(0) || user.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <p className="text-lg text-gray-500">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Member since</p>
            <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-500">Current Team</p>
            <p>{user.currentTeamId ? 'Active Team Member' : 'Not in a team'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 