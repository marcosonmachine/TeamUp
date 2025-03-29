import { db } from './firebase';
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, query, where, serverTimestamp, onSnapshot } from 'firebase/firestore';
import type { Project, Team, JoinRequest, Invitation, User, ProjectMember, TeamMember, Task, Message } from '@/types';

export type { Project };

// Projects
export async function createProject(data: Omit<Project, 'projectId' | 'createdAt' | 'updatedAt'>) {
  const projectRef = await addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return projectRef.id;
}

export async function getProject(projectId: string) {
  const projectDoc = await getDoc(doc(db, 'projects', projectId));
  return projectDoc.exists() ? { projectId: projectDoc.id, ...projectDoc.data() } as Project : null;
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, { ...data, updatedAt: serverTimestamp() });
}

// Project Members
export async function joinProject(projectId: string, userId: string) {
  const projectMemberRef = await addDoc(collection(db, `projects/${projectId}/members`), {
    userId,
    joinDate: serverTimestamp(),
  });
  return projectMemberRef.id;
}

export async function addProjectMember(projectId: string, data: Omit<ProjectMember, 'joinDate'>) {
  const memberRef = await addDoc(collection(db, `projects/${projectId}/members`), {
    ...data,
    joinDate: serverTimestamp(),
  });
  return memberRef.id;
}

export async function getProjectMembers(projectId: string) {
  const membersSnapshot = await getDocs(collection(db, `projects/${projectId}/members`));
  return membersSnapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }) as ProjectMember);
}



// Teams
export async function createTeam(data: Omit<Team, 'teamId' | 'createdAt' | 'updatedAt'>) {
  const teamRef = await addDoc(collection(db, 'teams'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return teamRef.id;
}

export async function getTeam(teamId: string) {
  const teamDoc = await getDoc(doc(db, 'teams', teamId));
  return teamDoc.exists() ? { teamId: teamDoc.id, ...teamDoc.data() } as Team : null;
}

export async function getProjectTeams(projectId: string) {
  const teamsQuery = query(collection(db, 'teams'), where('projectId', '==', projectId));
  const teamsSnapshot = await getDocs(teamsQuery);
  return teamsSnapshot.docs.map(doc => ({ teamId: doc.id, ...doc.data() }) as Team);
}

export async function updateTeam(teamId: string, data: Partial<Team>) {
  const teamRef = doc(db, 'teams', teamId);
  await updateDoc(teamRef, { ...data, updatedAt: serverTimestamp() });
}

// Team Members
export async function addTeamMember(teamId: string, data: Omit<TeamMember, 'joinDate'>) {
  const memberRef = await addDoc(collection(db, `teams/${teamId}/members`), {
    ...data,
    joinDate: serverTimestamp(),
  });
  return memberRef.id;
}

export async function getTeamMembers(teamId: string) {
  const membersSnapshot = await getDocs(collection(db, `teams/${teamId}/members`));
  return membersSnapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }) as TeamMember);
}

// Tasks
// export async function createTask(teamId: string, data: Omit<Task, 'taskId' | 'dueDate'>) {
//   const taskRef = await addDoc(collection(db, `teams/${teamId}/tasks`), {
//     ...data,
//     dueDate: serverTimestamp(),
//   });
//   return taskRef.id;
// }

// export async function getTeamTasks(teamId: string) {
//   const tasksSnapshot = await getDocs(collection(db, `teams/${teamId}/tasks`));
//   return tasksSnapshot.docs.map(doc => ({ taskId: doc.id, ...doc.data() }) as Task);
// }

// export async function updateTask(teamId: string, taskId: string, data: Partial<Task>) {
//   const taskRef = doc(db, `teams/${teamId}/tasks`, taskId);
//   await updateDoc(taskRef, data);
// }

// Messages
// export async function sendMessage(teamId: string, data: Omit<Message, 'messageId' | 'timestamp'>) {
//   const messageRef = await addDoc(collection(db, `teams/${teamId}/messages`), {
//     ...data,
//     timestamp: serverTimestamp(),
//   });
//   return messageRef.id;
// }

// export async function getTeamMessages(teamId: string) {
//   const messagesSnapshot = await getDocs(collection(db, `teams/${teamId}/messages`));
//   return messagesSnapshot.docs.map(doc => ({ messageId: doc.id, ...doc.data() }) as Message);
// }

// Join Requests
export async function createJoinRequest(data: Omit<JoinRequest, 'requestId' | 'createdAt' | 'status'>) {
  const requestRef = await addDoc(collection(db, 'joinRequests'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return requestRef.id;
}

export async function updateJoinRequest(requestId: string, status: 'accepted' | 'rejected') {
  const requestRef = doc(db, 'joinRequests', requestId);
  await updateDoc(requestRef, { status });
}

export async function getTeamJoinRequests(teamId: string) {
  const requestsQuery = query(
    collection(db, 'joinRequests'),
    where('teamId', '==', teamId),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(requestsQuery);
  return snapshot.docs.map(doc => ({ requestId: doc.id, ...doc.data() }) as JoinRequest);
}

export function subscribeToTeamJoinRequests(teamId: string, callback: (requests: JoinRequest[]) => void) {
  const requestsQuery = query(
    collection(db, 'joinRequests'),
    where('teamId', '==', teamId),
    where('status', '==', 'pending')
  );
  
  return onSnapshot(requestsQuery, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ requestId: doc.id, ...doc.data() }) as JoinRequest);
    callback(requests);
  });
}

// Invitations
export async function createInvitation(data: Omit<Invitation, 'invitationId' | 'createdAt' | 'status'>) {
  const invitationRef = await addDoc(collection(db, 'invitations'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return invitationRef.id;
}

export async function updateInvitation(invitationId: string, status: 'accepted' | 'rejected') {
  const invitationRef = doc(db, 'invitations', invitationId);
  await updateDoc(invitationRef, { status });
}

export function subscribeToUserInvitations(userId: string, callback: (invitations: Invitation[]) => void) {
  const invitationsQuery = query(
    collection(db, 'invitations'),
    where('receiver', '==', userId),
    where('status', '==', 'pending')
  );
  
  return onSnapshot(invitationsQuery, (snapshot) => {
    const invitations = snapshot.docs.map(doc => ({ invitationId: doc.id, ...doc.data() }) as Invitation);
    callback(invitations);
  });
}

export async function getTeamInvitations(teamId: string) {
  const invitationsQuery = query(
    collection(db, 'invitations'),
    where('team', '==', teamId),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(invitationsQuery);
  return snapshot.docs.map(doc => ({ invitationId: doc.id, ...doc.data() }) as Invitation);
}

// Users
export async function createOrUpdateUser(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getUser(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? { userId: userDoc.id, ...userDoc.data() } as User : null;
}

export async function updateUserTeam(userId: string, teamId: string | null) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    currentTeamId: teamId,
    updatedAt: serverTimestamp(),
  });
}

export async function updateProfile({ userId, displayName, photoURL }: { userId: string; displayName: string; photoURL: string; }) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    displayName,
    photoURL,
  });
}