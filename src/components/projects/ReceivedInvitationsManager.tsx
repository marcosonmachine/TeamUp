import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Invitation } from '@/types';
import { useAuthContext } from '@/providers/AuthProvider';

export default function ReceivedInvitationsManager() {
  const { user } = useAuthContext();
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    const loadInvitations = async () => {
      if (!user) return;
      const invitationsRef = collection(db, 'invitations');
      const q = query(invitationsRef, where('userId', '==', user.uid), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const invitationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invitation));
      setInvitations(invitationsData);
    };

    loadInvitations();
  }, [user]);

  const handleAccept = async (invitationId: string) => {
    const invitationRef = doc(db, 'invitations', invitationId);
    await updateDoc(invitationRef, { status: 'accepted' });
    setInvitations(invitations.filter(inv => inv.id !== invitationId));
  };

  const handleReject = async (invitationId: string) => {
    const invitationRef = doc(db, 'invitations', invitationId);
    await updateDoc(invitationRef, { status: 'rejected' });
    setInvitations(invitations.filter(inv => inv.id !== invitationId));
  };

  return (
    <div className="received-invitations-manager">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Received Invitations</h2>
      {invitations.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No pending invitations.</p>
      ) : (
        <ul className="space-y-4">
          {invitations.map((invitation) => (
            <li key={invitation.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-gray-800 dark:text-gray-200">Invitation to join team: {invitation.teamId}</p>
              <p className="text-gray-600 dark:text-gray-400">Message: {invitation.message || 'No message'}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleAccept(invitation.id)}
                  className="mr-2 py-2 px-4 bg-green-600 dark:bg-green-700 text-white rounded-md"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(invitation.id)}
                  className="py-2 px-4 bg-red-600 dark:bg-red-700 text-white rounded-md"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 