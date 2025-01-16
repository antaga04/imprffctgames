import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthInput from './ui/AuthInput';
import { toast } from 'sonner';
import { updateAccount, updatePassword } from '@/services/userServices';
import axios from 'axios';
import { ACCOUNT_INPUTS, PASSWORD_INPUTS } from '@/lib/constants';

const ProfileForm: React.FC<ProfileFormProps> = ({ profileData, setProfileData }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <Tabs defaultValue="account" className="md:w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="rounded-xl border shadow space-y-4 p-6">
                    <AccountTab profileData={profileData} setProfileData={setProfileData} />
                </TabsContent>
                <TabsContent value="password" className="rounded-xl border shadow space-y-4 p-6">
                    <PasswordTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};

const AccountTab: React.FC<ProfileFormProps> = ({ profileData, setProfileData }) => {
    const [fields, setFields] = useState({ nickname: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(false);

    useEffect(() => {
        setFields({ nickname: profileData.nickname, email: profileData.email });
    }, [profileData]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        const token = localStorage.getItem('jwt');
        if (!token) return;

        try {
            await updateAccount(fields, token);
            setProfileData({ ...profileData, ...fields });
            toast.success('Profile updated successfully!');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Failed to update profile.';
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
            setIsEdited(false);
        }
    };

    const handleCancel = () => {
        setIsEdited(false);
        setFields({ nickname: profileData.nickname, email: profileData.email });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsEdited(true);
        setFields({ ...fields, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            {ACCOUNT_INPUTS.map(({ label, name, type, placeholder, Icon }) => (
                <AuthInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    Icon={Icon}
                    value={fields[name as keyof typeof fields]}
                    onChange={(e) => handleInputChange(e)}
                    disabled={loading}
                />
            ))}
            <EditButtons handleCancel={handleCancel} loading={loading} isEdited={isEdited} />
        </form>
    );
};

const PasswordTab: React.FC = () => {
    const [fields, setFields] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (fields.newPassword !== fields.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('jwt');
        if (!token) return;

        try {
            await updatePassword({ password: fields.currentPassword, newPassword: fields.newPassword }, token);
            toast.success('Password updated successfully!');
            setFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Failed to update password.';
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
            setIsEdited(false);
        }
    };

    const handleCancel = () => {
        setIsEdited(false);
        setFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFields = { ...fields, [name]: value };

        // Check if all fields are filled
        const allFieldsFilled = Object.values(updatedFields).every((field) => field.trim() !== '');

        setFields(updatedFields);
        setIsEdited(allFieldsFilled);
    };

    return (
        <form onSubmit={handleSubmit}>
            {PASSWORD_INPUTS.map(({ label, name, type, placeholder, Icon }) => (
                <AuthInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    Icon={Icon}
                    value={fields[name as keyof typeof fields]}
                    onChange={(e) => handleInputChange(e)}
                    disabled={loading}
                />
            ))}
            <EditButtons handleCancel={handleCancel} loading={loading} isEdited={isEdited} />
        </form>
    );
};

const EditButtons: React.FC<EditButtonsProps> = ({ handleCancel, loading, isEdited }) => {
    return (
        <div className="mt-6">
            <button
                type="submit"
                className={`px-4 py-2 rounded-md transition-colors ${
                    isEdited
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!isEdited || loading}
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
                type="button"
                onClick={handleCancel}
                className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
                Cancel
            </button>
        </div>
    );
};

export default ProfileForm;
