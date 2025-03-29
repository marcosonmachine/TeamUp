"use client";
import { useState } from 'react';

export default function Setup() {
    const [displayName, setDisplayName] = useState('');
    const [avatars, setAvatars] = useState<string[]>([]);
    const [step, setStep] = useState(1);

    const generateAvatars = (name: string) => {
        const variations = [
            name,
            name.replace(' ', ''),
            name.split(' ').reverse().join(''),
            name.replace(' ', '-'),
            name.replace(' ', '_')
        ];
        return variations.map(variation => `https://api.dicebear.com/9.x/adventurer/svg?seed=${variation}`);
    };

    const handleNext = () => {
        setAvatars(generateAvatars(displayName));
        setStep(2);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Setup Your Profile</h2>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleNext}
                            className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Next
                        </button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Select Your Avatar</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {avatars.map((avatar, index) => (
                                <img
                                    key={index}
                                    src={avatar}
                                    alt={`Avatar ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}