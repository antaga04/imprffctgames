import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { ProfileData } from '@/types/types';
import { Camera, User } from 'lucide-react';

const UPLOAD_URL = import.meta.env.VITE_API_URL + '/users/avatar/';

type AvatarUploaderProps = {
    currentAvatar: string | null;
    setProfileData: (data: ProfileData | ((prevData: ProfileData) => ProfileData)) => void;
};

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatar, setProfileData }) => {
    const { user, updateUser } = useAuth();
    const [avatarPreview, setAvatarPreview] = useState(currentAvatar || null);
    const [avatar, setAvatar] = useState<File | null>(null);

    const token = localStorage.getItem('jwt');

    useEffect(() => {
        if (currentAvatar) {
            setAvatarPreview(currentAvatar);
        }
    }, [currentAvatar]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSaveAvatar = async () => {
        if (!avatar) return;
        if (!token) {
            console.error('No token found');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', avatar);

        const saveAvatar = async () => {
            const response = await axios.put(UPLOAD_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedAvatar = response.data.data;
            const updatedUser = { ...user, avatar: updatedAvatar };
            updateUser(updatedUser);
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
            <div className="relative w-fit">
                {avatarPreview ? (
                    <img src={avatarPreview} alt="User Avatar" className="w-32 h-32 rounded-full object-cover" />
                ) : (
                    <span className="w-32 h-32 rounded-full text-gray-400 bg-slate-800 flex items-center justify-center fill-white">
                        <User />
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
