import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
import MyAvatar from './ui/MyAvatar';

const UPLOAD_URL = import.meta.env.VITE_API_URL + '/users/avatar/';

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatar, profileData, setProfileData }) => {
    const [avatarPreview, setAvatarPreview] = useState(currentAvatar || null);
    const [avatar, setAvatar] = useState<File | null>(null);

    useEffect(() => {
        if (currentAvatar) {
            setAvatarPreview(currentAvatar);
        }
    }, [currentAvatar]);

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview); // Cleanup blob URL
            }
        };
    }, [avatarPreview]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
        e.target.value = '';
    };

    const handleSaveAvatar = async () => {
        if (!avatar) return;
        const formData = new FormData();
        formData.append('avatar', avatar);

        const saveAvatar = async () => {
            const response = await axios.put(UPLOAD_URL, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedAvatar = response.data.data;
            setProfileData((prevData: ProfileData) => ({
                ...prevData,
                avatar: updatedAvatar,
            }));

            setAvatarPreview(updatedAvatar);
            setAvatar(null);
        };

        try {
            toast.promise(saveAvatar, {
                loading: 'Saving avatar...',
                success: 'Avatar updated successfully!',
                error: (err) => err.response?.data?.error || 'Saving failed. Please try again.',
            });
        } catch (error) {
            console.error('Error updating avatar:', error);
            toast.error('An error occurred updating avatar.');
        }
    };

    const handleCancelAvatar = () => {
        setAvatarPreview(currentAvatar);
        setAvatar(null);
    };

    return (
        <div className="relative flex flex-col items-center">
            <div className="relative w-fit flex">
                {avatarPreview ? (
                    <MyAvatar url={avatarPreview} alt="User Avatar" width="w-32" height="h-32" />
                ) : (
                    <span className="w-32 h-32 rounded-full text-white text-xl bg-[var(--blue)] flex items-center justify-center">
                        {profileData.nickname.slice(0, 2).toUpperCase()}
                    </span>
                )}
                <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 text-blue-500 hover:text-blue-600 transition-colors"
                >
                    <Camera className="fill-black h-7 w-7" />
                </label>
                <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                />
            </div>
            <div className="mt-2 flex gap-2">
                {avatar ? (
                    <>
                        <button
                            onClick={handleSaveAvatar}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Save Avatar
                        </button>
                        <button
                            onClick={handleCancelAvatar}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default AvatarUploader;
