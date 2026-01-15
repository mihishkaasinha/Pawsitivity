import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, LogOut, X, Save, MapPin, Mail, Phone, Camera, Edit3, Upload, Trophy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    city: '',
    memberType: 'Free Member',
    image: '',
    points: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(user);
  const [preview, setPreview] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Ensure points exist
      if (parsedUser.points === undefined) parsedUser.points = 0;
      setUser(parsedUser);
      setEditForm(parsedUser);
      if (parsedUser.image) {
        setPreview(parsedUser.image);
      }
    } else {
      // If no user, automatically enter edit mode for "Sign In" / "Create Profile"
      setIsEditing(true);
    }
  }, []);

  const handleEditClick = () => {
    setEditForm(user);
    setPreview(user.image || null);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isNewProfile = !user.name;
    
    // Preserve points during edit
    const updatedProfile = { ...editForm, points: user.points || 0 };
    
    setUser(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setIsEditing(false);

    if (isNewProfile) {
        navigate('/home');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setEditForm(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    const parts = (name || 'Guest User').trim().split(' ');
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Gamification Logic
  const getRank = (points: number = 0) => {
    if (points < 50) return { title: 'Newbie 🥚', color: 'bg-gray-100 text-gray-600' };
    if (points < 150) return { title: 'Puppy 🐶', color: 'bg-blue-100 text-blue-600' };
    if (points < 300) return { title: 'Good Boy/Girl 🦴', color: 'bg-purple-100 text-purple-600' };
    if (points < 500) return { title: 'Pack Leader 🐺', color: 'bg-orange-100 text-orange-600' };
    return { title: 'Legend 👑', color: 'bg-yellow-100 text-yellow-700' };
  };

  const rank = getRank(user.points);

  return (
    <div className="max-w-3xl mx-auto p-6 pb-24">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        {user.name ? 'Settings ⚙️' : 'Welcome to Pawsitivity 🐾'}
      </h1>

      {/* Profile Card */}
      {!user.name && !isEditing ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-sm border border-gray-400 dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">Sign in to access community features and personalize your experience.</p>
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-paws-pink text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-teal-600 transition-colors"
            >
                Create Profile
            </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-400 dark:border-gray-700 overflow-hidden mb-8 transition-colors duration-200 relative group">
            <div className="h-32 bg-gradient-to-r from-paws-pink to-paws-orange opacity-90"></div>
            <div className="px-8 pb-8">
                <div className="relative -mt-12 mb-4 flex justify-between items-end">
                    <div className="w-24 h-24 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg overflow-hidden border border-gray-400 dark:border-gray-700">
                        {user.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner">
                                {getInitials(user.name)}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleEditClick}
                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Edit3 size={16} /> Edit Profile
                    </button>
                </div>
                
                <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                            {user.name || 'Guest User'}
                        </h2>
                        <div className="flex gap-2">
                             {user.memberType && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200 uppercase tracking-wide font-bold flex items-center gap-1">
                                    <Star size={12} fill="currentColor" /> {user.memberType}
                                </span>
                            )}
                            <span className={`${rank.color} text-xs px-2 py-1 rounded-full border border-current opacity-80 uppercase tracking-wide font-bold flex items-center gap-1`}>
                                {rank.title}
                            </span>
                        </div>
                    </div>

                    {/* Paw Points Section */}
                    <div className="inline-flex items-center gap-2 bg-paws-pink/10 dark:bg-paws-pink/20 text-paws-pink px-4 py-2 rounded-xl mb-4">
                        <Trophy size={18} />
                        <span className="font-bold">{user.points || 0} Paw Points</span>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-300 dark:border-transparent">
                            <Mail size={18} className="text-paws-blue" />
                            <span className="text-sm font-bold">{user.email || 'No email added'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-300 dark:border-transparent">
                            <Phone size={18} className="text-paws-green" />
                            <span className="text-sm font-bold">{user.phone || 'No phone added'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-300 dark:border-transparent md:col-span-2">
                            <MapPin size={18} className="text-red-400" />
                            <span className="text-sm font-bold">{user.city ? `${user.city}, India` : 'Location not set'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* System Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-400 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Preferences</h3>
            
            <div className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-300">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full text-yellow-600 dark:text-yellow-300 border border-yellow-300 dark:border-transparent"><Bell size={20} /></div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-gray-200">Push Notifications</span>
                    <span className="text-xs text-gray-600">Reminders for food, walks & vaccines</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-400 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-paws-pink"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-300">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full text-green-600 dark:text-green-300 border border-green-300 dark:border-transparent"><Shield size={20} /></div>
                <span className="font-bold text-gray-900 dark:text-gray-200">Privacy & Security</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <h3 className="font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">System</h3>
             <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-400 dark:border-gray-600">
                <h4 className="font-black text-gray-900 dark:text-white mb-1">API Configuration</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Gemini API Key is managed via environment variables.</p>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                   <span className="text-xs font-bold font-mono text-gray-700 dark:text-gray-400">process.env.API_KEY is active</span>
                </div>
            </div>
          </div>

           <button 
            onClick={() => {
                if(window.confirm("Are you sure you want to log out? This will clear your profile.")) {
                    localStorage.removeItem('userProfile');
                    setUser({
                        name: '',
                        email: '',
                        phone: '',
                        city: '',
                        memberType: 'Free Member',
                        image: '',
                        points: 0
                    });
                    setIsEditing(true);
                }
            }}
            className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-black p-4 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-2xl transition-colors border border-transparent hover:border-red-300"
           >
            <LogOut size={20} />
            Log Out / Clear Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal - Acts as Sign In */}
      {isEditing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-[40px] w-full max-w-md p-10 shadow-2xl transform transition-all scale-100 border border-gray-300 dark:border-gray-700 my-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase">
                {user.name ? 'Edit Profile' : 'Create Profile'}
              </h2>
              {user.name && (
                <button onClick={() => setIsEditing(false)} className="p-3 bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all text-gray-500 hover:text-paws-pink">
                  <X size={24} />
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-28 h-28 rounded-full border-4 border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-600 relative shadow-inner">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <User size={48} />
                        </div>
                    )}
                </div>
                <label className="flex items-center gap-2 px-6 py-2 bg-paws-blue/10 text-paws-blue rounded-full text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-paws-blue/20 transition-colors border border-paws-blue/30">
                    <Camera size={16} />
                    {preview ? 'Change Photo' : 'Upload Photo'}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 ml-2">Full Name</label>
                <input 
                    name="name"
                    type="text" 
                    required
                    placeholder="e.g. Aditya Kumar"
                    value={editForm.name}
                    onChange={handleChange}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-transparent rounded-2xl px-6 py-5 focus:ring-4 focus:ring-paws-pink/10 text-gray-900 dark:text-white font-black text-lg placeholder-gray-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 ml-2">Email Address</label>
                <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="e.g. aditya@example.com"
                    value={editForm.email}
                    onChange={handleChange}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-transparent rounded-2xl px-6 py-5 focus:ring-4 focus:ring-paws-pink/10 text-gray-900 dark:text-white font-black text-lg placeholder-gray-500 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 ml-2">Phone Number</label>
                <input 
                    name="phone"
                    type="tel" 
                    required
                    placeholder="+91"
                    value={editForm.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-transparent rounded-2xl px-6 py-5 focus:ring-4 focus:ring-paws-pink/10 text-gray-900 dark:text-white font-black text-lg placeholder-gray-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 ml-2">City</label>
                    <input 
                        name="city"
                        type="text" 
                        required
                        placeholder="Mumbai"
                        value={editForm.city}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-transparent rounded-2xl px-6 py-5 focus:ring-4 focus:ring-paws-pink/10 text-gray-900 dark:text-white font-black text-lg placeholder-gray-500 shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 ml-2">Membership</label>
                    <select 
                        name="memberType"
                        value={editForm.memberType}
                        onChange={handleChange}
                        className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-transparent rounded-2xl px-6 py-5 focus:ring-4 focus:ring-paws-pink/10 text-gray-900 dark:text-white font-black text-lg shadow-inner"
                    >
                        <option>Free Member</option>
                        <option>Premium Member</option>
                        <option>Vet Professional</option>
                    </select>
                  </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-paws-pink text-white font-black py-6 rounded-[32px] hover:bg-teal-600 transition-all mt-4 shadow-2xl flex items-center justify-center gap-2 uppercase tracking-widest italic border-b-8 border-rose-700 active:border-b-0 active:translate-y-1"
              >
                <Save size={24} />
                {user.name ? 'Save Changes' : 'Launch Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;