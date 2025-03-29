import { useEffect, useState } from "react"

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { fetchProjects } from "@/lib/api"

import { Card } from "@/components/ui/card"
import CreateProjectDialogClient from "@/components/projects/CreateProjectDialogClient"
import JoinProjectDialogClient from "@/components/projects/JoinProjectDialogClient"
import ProjectListClient from "@/components/projects/ProjectListClient"
import ReceivedInvitationsManager from "@/components/projects/ReceivedInvitationsManager"
import { useAuthContext } from "@/providers/AuthProvider"

export default function DashboardPage() {
    const { user } = useAuthContext();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            const projectsData = await fetchProjects();
            setProjects(projectsData);
            setLoading(false);
        };
        loadProjects();
    }, []);


    return (
        <Card className="m-4 p-4 bg-white dark:bg-gray-800">
            <div className="flex flex-col justify-center items-center h-64 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white dark:text-gray-200 p-6 rounded-lg shadow-md mb-8">

               <h2 className="text-3xl font-bold m-4 p-4 text-center">Welcome to TeamUp, {user?.displayName}!</h2>
                <p className="text-lg mb-4 text-center">Collaborate, manage, and grow your projects with ease.</p>
            </div>
            <main className="container py-8 px-6 bg-gray-50 dark:bg-gray-900 shadow-lg rounded-lg">
                <div className="flex flex-col space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between pb-4 mb-4">
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200">Your Projects</h1>
                        <div className="flex gap-6">
                            <CreateProjectDialogClient projectId="defaultProjectId" />
                            <JoinProjectDialogClient />
                        </div>
                    </div>
                    <ProjectListClient projects={projects} />

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Invitations</h2>
                        <ReceivedInvitationsManager />
                    </div>
                </div>
            </main>
        </Card>
    )
}