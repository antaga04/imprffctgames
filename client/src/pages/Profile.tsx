import { useState, useEffect } from 'react';
import BackButton from '@/components/ui/BackButton';
import AvatarUploader from '@/components/AvatarUploader';
import ProfileForm from '@/components/ProfileForm';
import { fetchUserData, requestAccountDeletion } from '@/services/userServices';
import { toast } from 'sonner';
import { scoreFormatter } from '@/lib/gameUtils';
import { useTranslation } from 'react-i18next';
import { decisionToast } from '@/lib/decisionToast';

const Profile = () => {
    const { t } = useTranslation();
    const [profileData, setProfileData] = useState<ProfileData>({
        nickname: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        avatar: '',
        scores: [],
    });

    const fetchUser = async () => {
        try {
            const response = await fetchUserData();
            const { payload } = response.data;

            setProfileData(payload);
        } catch (error) {
            console.error('Error fetching user data:', error);
            const err = error as MyError;
            toast.error(t(`server.${err.response?.data?.i18n}`) || t('profile.error'));
        }
    };

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <BackButton />
            <section className="flex flex-col w-full md:p-4 md:mt-40 mx-auto max-w-[425px] md:max-w-[500px] mt-24 gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                <h1 className="text-3xl font-bold mb-6 text-center">{t('profile.title')}</h1>
                <div className="flex flex-col items-center gap-4">
                    <AvatarUploader
                        currentAvatar={profileData.avatar}
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />

                    <ProfileForm profileData={profileData} setProfileData={setProfileData} />
                </div>
            </section>
            <ScoreSection scores={profileData?.scores} />
            <DangerSection />
        </div>
    );
};

export default Profile;

const ScoreSection: React.FC<{ scores: Score[] }> = ({ scores }) => {
    return (
        <section className="flex flex-wrap items-center gap-2 my-4 max-w-[425px] md:max-w-[500px] mx-auto">
            {scores?.map((score: Score) => (
                <div
                    key={score._id}
                    className="w-full grid grid-cols-2 sm:grid-cols-3 justify-center bg-slate-700 rounded-lg shadow-md p-4 sm:gap-4 items-center"
                >
                    <div className="inline-flex items-center gap-2">
                        <img
                            src={score.game_id.cover || ''}
                            alt={score.game_id.name || ''}
                            className="w-10 h-10 object-cover rounded-full shadow-md"
                            draggable="false"
                        />

                        <h2 className="text-lg font-semibold whitespace-nowrap">{score.game_id.name}</h2>
                    </div>

                    <p className="text-sm text-center">{scoreFormatter(score.scoreData)}</p>

                    <p className="text-sm col-span-2 sm:col-span-1 text-center">
                        {new Date(score.createdAt).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </section>
    );
};

const DangerSection: React.FC = () => {
    const { t } = useTranslation();
    const [isShown, setIsShown] = useState(false);

    const handleDeleteAccount = async () => {
        if (isShown) return;
        setIsShown(true);

        decisionToast({
            title: t('profile.danger_zone.delete.toast.title'),
            body: (
                <div>
                    <p>{t('profile.danger_zone.delete.toast.p1')}</p>
                    <p className="mt-2 font-medium">{t('profile.danger_zone.delete.toast.p2')}</p>
                </div>
            ),
            confirmText: t('profile.danger_zone.delete.button'),
            confirmClassName: 'px-4 py-1 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 transition',
            onConfirm: async () => {
                toast.promise(requestAccountDeletion(), {
                    loading: t('profile.danger_zone.delete.toast.loading'),
                    success: (res) => t(`server.${res.data.i18n}`) || t('profile.danger_zone.delete.toast.success'),
                    error: (err) =>
                        t(`server.${err.response?.data?.i18n}`) || t('profile.danger_zone.delete.toast.error'),
                });
                setIsShown(false);
            },
            onCancel: () => {
                setIsShown(false);
            },
        });
    };

    return (
        <section className="flex flex-col items-center gap-4 my-12 max-w-[425px] md:max-w-[500px] mx-auto border-t border-b border-white border-dashed px-8 py-4">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('profile.danger_zone.title')}</h2>
            <div className="self-center space-y-4">
                <p>{t('profile.danger_zone.delete.p1')}</p>
                <p>{t('profile.danger_zone.delete.p2')}</p>
                <p>{t('profile.danger_zone.delete.p3')}</p>
            </div>
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                    {t('profile.danger_zone.delete.button')}
                </button>
            </div>
        </section>
    );
};
