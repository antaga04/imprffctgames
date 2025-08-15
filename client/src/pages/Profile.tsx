import { useState, useEffect } from 'react';
import BackButton from '@/components/ui/BackButton';
import AvatarUploader from '@/components/AvatarUploader';
import ProfileForm from '@/components/ProfileForm';
import { fetchUserData } from '@/services/userServices';
import { toast } from 'sonner';

const Profile = () => {
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
            toast.error(err.response?.data?.message || 'Error fetching user data.');
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div>
            <BackButton />
            <section className="flex flex-col w-full md:p-4 md:mt-40 mx-auto max-w-[425px] md:max-w-[500px] mt-24 gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
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

                    <div className="text-sm text-center">
                        {score.scoreData.moves !== undefined && score.scoreData.time !== undefined && (
                            <p>
                                Moves: <span className="font-medium">{score.scoreData.moves}</span> | Time:{' '}
                                <span className="font-medium">{score.scoreData.time}s</span>
                            </p>
                        )}
                        {score.scoreData.correct !== undefined && score.scoreData.total !== undefined && (
                            <p>
                                Correct: <span className="font-medium">{score.scoreData.correct}</span>/
                                <span className="font-medium">{score.scoreData.total}</span>
                            </p>
                        )}
                    </div>

                    <p className="text-sm col-span-2 sm:col-span-1 text-center">
                        {new Date(score.createdAt).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </section>
    );
};
