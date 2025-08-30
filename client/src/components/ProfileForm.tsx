import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthInput from './ui/AuthInput';
import { toast } from 'sonner';
import { updateAccount, updatePassword } from '@/services/userServices';
import { ACCOUNT_INPUTS, PASSWORD_INPUTS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { focusFirstInvalidField, runValidations } from '@/lib/validate';
import { useTranslation } from 'react-i18next';

const ProfileForm: React.FC<ProfileFormProps> = ({ profileData, setProfileData }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full flex flex-col items-center">
            <Tabs defaultValue="account" className="md:w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">{t('profile.account')}</TabsTrigger>
                    <TabsTrigger value="password">{t('profile.password')}</TabsTrigger>
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
    const { t } = useTranslation();
    const [fields, setFields] = useState<AccountFields>({ nickname: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        setFields({ nickname: profileData.nickname, email: profileData.email });
    }, [profileData]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (disable) return;

        setDisable(true);
        setTimeout(() => setDisable(false), 2000);

        const { errors, allErrors } = runValidations(fields);
        if (allErrors.length > 0) {
            focusFirstInvalidField(errors);
            toast.error(t('validations.fix_errors'));
            return;
        }

        setLoading(true);

        toast.promise(updateAccount({ nickname: fields.nickname }), {
            loading: t('profile.account_tab.loading'),
            success: () => {
                setProfileData({ ...profileData, ...fields });
                return t('profile.account_tab.success');
            },
            error: (err) => t(`server.${err.response?.data?.i18n}`) || t('profile.account_tab.error'),
            finally: () => {
                setLoading(false);
                setIsEdited(false);
            },
        });
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {ACCOUNT_INPUTS.map(({ label, name, type, placeholder, Icon }) => (
                <AuthInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    Icon={Icon}
                    value={fields[name as keyof typeof fields]}
                    onChange={handleInputChange}
                    disabled={loading || type === 'email'}
                    activeValidation={isEdited && !(loading || type === 'email')}
                />
            ))}
            <EditButtons
                handleCancel={handleCancel}
                loading={loading}
                isEdited={isEdited ? isEdited && !disable : isEdited}
            />
        </form>
    );
};

const PasswordTab: React.FC = () => {
    const { t } = useTranslation();
    const [fields, setFields] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [disable, setDisable] = useState(false);
    const { logout } = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (disable) return;

        setDisable(true);
        setTimeout(() => setDisable(false), 2000);

        const { errors, allErrors } = runValidations(fields);
        if (allErrors.length > 0) {
            focusFirstInvalidField(errors);
            toast.error(t('validations.fix_errors'));
            return;
        }

        setLoading(true);

        toast.promise(updatePassword({ password: fields.currentPassword, newPassword: fields.newPassword }), {
            loading: t('profile.password_tab.loading'),
            success: () => {
                setFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
                logout();
                return t('profile.password_tab.success');
            },
            error: (err) => {
                return t(`server.${err.response?.data?.i18n}`) || t('profile.password_tab.error');
            },
            finally: () => {
                setLoading(false);
                setIsEdited(false);
            },
        });
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {PASSWORD_INPUTS.map(({ label, name, type, placeholder, Icon }) => (
                <AuthInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    Icon={Icon}
                    value={fields[name as keyof typeof fields]}
                    onChange={handleInputChange}
                    disabled={loading}
                    activeValidation={true}
                    originalPassword={type === 'password' ? fields.newPassword : undefined}
                />
            ))}
            <EditButtons
                handleCancel={handleCancel}
                loading={loading}
                isEdited={isEdited ? isEdited && !disable : isEdited}
            />
        </form>
    );
};

const EditButtons: React.FC<EditButtonsProps> = ({ handleCancel, loading, isEdited }) => {
    const { t } = useTranslation();
    return (
        <div>
            <button
                type="submit"
                className={`px-4 py-2 rounded-md transition-colors ${
                    isEdited
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!isEdited || loading}
            >
                {loading ? t('globals.saving') : t('globals.save')}
            </button>
            <button
                type="button"
                onClick={handleCancel}
                className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
                {t('globals.cancel')}
            </button>
        </div>
    );
};

export default ProfileForm;
