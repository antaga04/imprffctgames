import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Camera, Eraser } from 'lucide-react';
import MyAvatar from './ui/MyAvatar';

const UPLOAD_URL = import.meta.env.VITE_API_URL + '/users/avatar/';

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatar, profileData, setProfileData }) => {
    const [avatarPreview, setAvatarPreview] = useState(currentAvatar || null);
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [pendingDelete, setPendingDelete] = useState(false);

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
        setNewAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
        e.target.value = '';
        setPendingDelete(false);
    };

    const handleSaveAvatar = async () => {
        if (!newAvatar && !pendingDelete) return;

        const saveAction = async () => {
            if (pendingDelete) {
                await axios.delete(UPLOAD_URL, { withCredentials: true });
                setProfileData((prevData: ProfileData) => ({
                    ...prevData,
                    avatar: null,
                }));
                setPendingDelete(false);
                return null;
            } else {
                const formData = new FormData();
                formData.append('avatar', newAvatar!);
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
                setNewAvatar(null);
                return updatedAvatar;
            }
        };

        try {
            toast.promise(saveAction, {
                loading: pendingDelete ? 'Deleting avatar...' : 'Saving avatar...',
                success: pendingDelete ? 'Avatar deleted successfully!' : 'Avatar updated successfully!',
                error: (err) => err.response?.data?.error || 'Operation failed. Please try again.',
            });
        } catch (error) {
            console.error('Error saving avatar changes:', error);
            toast.error('An error occurred.');
        }
    };

    const handleDeleteAvatar = () => {
        setNewAvatar(null);
        setAvatarPreview(null);
        setPendingDelete(true);
    };

    const handleCancelAvatar = () => {
        setAvatarPreview(currentAvatar);
        setNewAvatar(null);
        setPendingDelete(false);
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
                <div className="flex absolute bottom-0 -right-6 rounded-full cursor-pointer transition-colors overflow-hidden">
                    <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer p-1 bg-blue-500 hover:bg-blue-600 text-blue-500 hover:text-blue-600"
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
                    <button
                        onClick={handleDeleteAvatar}
                        className="cursor-pointer p-1 bg-red-500 hover:bg-red-600 text-red-500 hover:text-red-600"
                    >
                        <Eraser className="text-black/80 h-6 w-6" />
                    </button>
                </div>
            </div>
            <div className="mt-2 flex gap-2">
                {newAvatar || pendingDelete ? (
                    <>
                        <button
                            onClick={handleSaveAvatar}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Save Changes
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
