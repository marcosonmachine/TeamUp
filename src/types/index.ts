// Collection: users
interface User {
    userId: string;
    name: string;
    email: string;
    projects: string[];
    teams: Array<{ projectId: string; teamId: string }>;
}

// Collection: projects
interface Project {
    projectId: string;
    ownerId: string
    name: string;
    maxTeamSize: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

// Subcollection: projects/[projectId]/members
interface ProjectMember {
    userId: string;
    rating: number;
    initialPrompt: string;
    joinDate: Date;
    // LLM form initial prompt
    attributes: []

    teamId?: string;
}

// Collection: teams
interface Team {
    teamId: string;
    projectId: string;
    name: string;
    members: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Subcollection: teams/[teamId]/members
interface TeamMember {
    userId: string;
    joinDate: Date;
}

// All tasks are formed from LLM using the initial prompt
// Subcollection: teams/[teamId]/tasks
interface Task {
    taskId: string;
    title: string;
    description: string;
    assignedTo: string;
    status: string;
    dueDate: Date;
}

// Subcollection: teams/[teamId]/messages
interface Message {
    messageId: string;
    senderId: string;
    content: string;
    timestamp: Date;
}

// Collection: joinRequests
interface JoinRequest {
    requestId: string;
    userId: string;
    teamId: string;
    status: string;
    createdAt: Date;
}

// Collection: invitations
interface Invitation {
    invitationId: string;
    senderId: string;
    receiverId: string;
    teamId: string;
    status: string;
    createdAt: Date;
}