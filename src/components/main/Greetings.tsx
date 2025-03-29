import { Card } from "@/components/ui/card";

export default function GreetingsPage() {
    return (
        <Card className="flex flex-col m-4 p-4 justify-center items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Welcome to Our Platform!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Join us to collaborate on exciting projects and connect with teams.</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
                <li>Discover and join projects that match your interests.</li>
                <li>Collaborate with team members in real-time.</li>
                <li>Manage your projects and teams efficiently.</li>
            </ul>
            <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">Please Sign In to get started.</p>
        </Card>
    );
}