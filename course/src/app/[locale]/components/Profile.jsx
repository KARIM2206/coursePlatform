

'use client';
import { Context } from '../CONTEXT/ContextProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthControl from './AuthControl';

const Profile = ({ dict, locale }) => {
  const { token, user, fetchUser } = useContext(Context);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('/logo.jpg'); // Default image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const router = useRouter();
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
      
      // Only update avatarPreview if user has an avatar
      if (user.avatar) {
        setAvatarPreview(`http://localhost:5000/${user.avatar}`);
      }
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
 setFormData(
  {
    ...formData,
    [name]: value
  }
 )
  };

  const uploadAvatar = async () => {
    if (!avatar || !token) return;

    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('avatar', avatar);

      const endpoint = user.avatar 
        ? 'http://localhost:5000/api/auth/updateAvatar'
        : 'http://localhost:5000/api/auth/uploads';

      const response = await fetch(endpoint, {
        method: user.avatar ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(user.avatar 
          ? 'Failed to update avatar' 
          : 'Failed to upload avatar');
      }

      const data = await response.json();
      console.log('Avatar success:', data);
      fetchUser();
    } catch (error) {
      console.error('Avatar error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload when avatar changes
  useEffect(() => {
  if (avatar) {
    uploadAvatar();
  }
  // Cleanup the object URL to avoid memory leaks
  return () => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }
  };
  }, [avatar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated:', data);
if (!data.ok) {
  toast.error(data.message || 'Failed to update profile');
}
      fetchUser();
    toast.success(data.massage || 'Profile updated successfully');
    router.push(`/${locale}/`);
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-tl from-blue-400 via-white to-blue-100 flex justify-center items-center p-4">
      <div className="max-w-4xl w-full  bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-center items-center relative">
            <div className="relative group">
              <Image
                src={avatarPreview || '/logo.jpg'} // Fallback to default image
                alt="Profile avatar"
                width={120}
                height={120}
                className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/logo.jpg'; // Fallback if image fails to load
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload profile picture"
                disabled={loading}
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

         <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-gray-600">
              {dict.name}
            </label>
            <input
              type="name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={dict.namePlaceholder}
              className="w-full px-4 py-2 border padding-input border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              disabled={loading}
            />
          </div>

         <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-600">
              {dict.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={dict.emailPlaceholder}
              className="w-full px-4 py-2 border padding-input border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-gray-600">
              {dict.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={dict.passwordPlaceholder}
              className="w-full px-4 py-2 padding-input border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 padding-input bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Updating...' : dict.submitButton || 'Update Profile'}
          </button>
        </form>
         <AuthControl dashboard={dict.dashboard} logout={dict.logout} locale={locale} role={user?.role} />
 
      </div>
     
    </div>
  );
};

export default Profile;