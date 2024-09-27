import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { CameraIcon, UserIcon } from '../icons';
import BackButton from '../components/BackButton';

const Profile = () => {
  const { token } = useAuth();
  const [profileData, setProfileData] = useState({
    nickname: '',
    email: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setProfileData({
          nickname: response.data.nickname,
          email: response.data.email,
          password: '',
        });
        setAvatarPreview(response.data.avatar);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await axios.put(
        'http://localhost:8080/api/users/',
        {
          nickname: profileData.nickname,
          email: profileData.email,
          password: profileData.password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveAvatar = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      await axios.post('http://localhost:8080/api/users/avatar/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <BackButton />
      <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px] mt-5 gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
        <div className="flex flex-col items-center gap-4">
          {/* Profile picture */}
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="User Avatar"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="w-32 h-32 text-gray-400" />
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
            >
              <CameraIcon className="w-6 h-6 text-white" />
            </label>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <button
              onClick={handleSaveAvatar}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save Avatar
            </button>
          </div>

          {/* Editable profile information */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-md">
              <label className="block text-sm font-medium text-gray-700">Nickname</label>
              <input
                type="text"
                name="nickname"
                value={profileData.nickname}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 p-2 border w-full rounded-md focus:outline-none ${
                  isEditing ? 'border-blue-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div className="w-full max-w-md mt-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 p-2 border w-full rounded-md focus:outline-none ${
                  isEditing ? 'border-blue-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div className="w-full max-w-md mt-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={profileData.password}
                onChange={handleInputChange}
                placeholder="********"
                disabled={!isEditing}
                className={`mt-1 p-2 border w-full rounded-md focus:outline-none ${
                  isEditing ? 'border-blue-500' : 'border-gray-300'
                }`}
              />
            </div>

            {isEditing ? (
              <div className="mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
