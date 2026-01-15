import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, ShoppingBag, MapPin, BookOpen, Settings, Moon, Sun, Search, CloudRain, MoreHorizontal, ChevronDown, HeartHandshake, Users, Calendar, Briefcase, HelpCircle, Sparkles, MessageSquare, ShieldCheck, Camera, LayoutDashboard } from 'lucide-react';
import { UserProfile } from '../types';

const PawsitivityIcon = () => (
  <svg viewBox="0 0 512 512" className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg">
    <circle cx="120" cy="140" r="75" fill="#3DA9A9" />
    <circle cx="392" cy="140" r="75" fill="#3DA9A9" />
    <circle cx="160" cy="400" r="95" fill="#48C3C3" />
    <circle cx="352" cy="400" r="95" fill="#48C3C3" />
    <path d="M256 80c-110 0-200 90-200 200v120c0 60 50 110 110 110h180c60 0 110-50 110-110V280c0-110-90-200-200-200z" fill="#48C3C3" />
    <circle cx="170" cy="270" r="45" fill="white" />
    <circle cx="342" cy="270" r="45" fill="white" />
    <circle cx="185" cy="270" r="22" fill="#3B82F6" />
    <circle cx="327" cy="270" r="22" fill="#3B82F6" />
    <circle cx="256" cy="330" r="18" fill="#2563EB" />
    <path d="M200 360q56 30 112 0" stroke="#2563EB" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path d="M180 430q76 35 152 0" stroke="#84CC16" strokeWidth="16" fill="none" strokeLinecap="round" />
    <circle cx="256" cy="465" r="20" fill="#84CC16" />
  </svg>
);

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const checkLogin = () => {
        const storedUser = localStorage.getItem('userProfile');
        setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [location]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const isActive = (path: string) => location.pathname === path;

  const primaryNavItems = [
    { name: 'Home', path: '/home', icon: <Home size={20} /> },
    { name: 'My Pack', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Social', path: '/discovery', icon: <Users size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
    { name: 'Ask AI', path: '/chat', icon: <Sparkles size={20} /> },
  ];

  const secondaryNavItems = [
    { name: 'Memory Vault', path: '/memory-vault', icon: <Camera size={18} /> },
    { name: 'Community Feed', path: '/community', icon: <BookOpen size={18} /> },
    { name: 'Care Circles', path: '/care-circles', icon: <ShieldCheck size={18} /> },
    { name: 'Pet Care Services', path: '/care-services', icon: <Briefcase size={18} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={18} /> },
    { name: 'Help Board', path: '/help-board', icon: <HelpCircle size={18} /> },
    { name: 'Adoption', path: '/adoption', icon: <HeartHandshake size={18} /> },
    { name: 'Paws Store', path: '/store', icon: <ShoppingBag size={18} /> },
    { name: 'Local Vets', path: '/services', icon: <MapPin size={18} /> },
    { name: 'Lost & Found', path: '/lost-and-found', icon: <Search size={18} /> },
    { name: 'Rainbow Bridge', path: '/rainbow-bridge', icon: <CloudRain size={18} /> },
  ];

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <>
      <nav className="bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-gray-300 dark:border-gray-800 sticky top-0 z-[110] transition-all duration-200 h-20 flex items-center">
        <div className="max-w-[1600px] mx-auto w-full px-4 md:px-8">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section - Points to /home */}
            <div className="flex items-center">
              <Link to="/home" className="flex-shrink-0 flex items-center group gap-3">
                <PawsitivityIcon />
                <div className="flex flex-col -space-y-1">
                  <span className="font-black text-xl tracking-tighter text-[#3DA9A9]">PAWSITIVITY</span>
                  <div className="h-1.5 w-12 bg-teal-500 rounded-full"></div>
                </div>
              </Link>
            </div>

            {/* Navigation Links - Centered & Optimized Spacing (Desktop) */}
            <div className="hidden xl:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-2 xl:gap-6 px-5 py-2 bg-gray-100 dark:bg-gray-800/30 rounded-[24px] border border-gray-300 dark:border-gray-700 shadow-inner">
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2.5 whitespace-nowrap
                      ${isActive(item.path) 
                        ? 'text-[#4F46E5] bg-white dark:bg-gray-700 shadow-[0_4px_12px_rgba(79,70,229,0.15)] ring-1 ring-gray-200' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-[#4F46E5]'
                      }`}
                  >
                    {item.icon}
                    <span className="hidden min-[1350px]:inline">{item.name}</span>
                  </Link>
                ))}

                <div className="relative">
                  <button 
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2.5 focus:outline-none
                      ${secondaryNavItems.some(i => isActive(i.path))
                          ? 'text-[#7C3AED] bg-white dark:bg-gray-700 shadow-[0_4px_12px_rgba(124,58,237,0.15)] ring-1 ring-gray-200' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-[#7C3AED]'
                      }`}
                  >
                    <MoreHorizontal size={20} />
                    <span className="hidden min-[1350px]:inline">Explore</span>
                    <ChevronDown size={14} className={`transform transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isMoreOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsMoreOpen(false)}></div>
                      <div className="absolute top-full right-0 mt-4 w-72 bg-white dark:bg-[#1E293B] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-300 dark:border-gray-700 py-4 z-20 animate-fade-in origin-top-right overflow-y-auto max-h-[80vh] scrollbar-hide">
                        {secondaryNavItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMoreOpen(false)}
                            className={`px-6 py-4 text-sm font-bold transition-all flex items-center gap-4
                              ${isActive(item.path) 
                                ? 'text-[#0D9488] bg-teal-50 dark:bg-teal-900/20' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0D9488]'
                              }`}
                          >
                            <div className={`${isActive(item.path) ? 'text-[#0D9488]' : 'text-gray-400'}`}>{item.icon}</div>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* User Profile & Controls */}
            <div className="flex items-center gap-2 md:gap-5">
              {user && (
                <Link to="/settings" className="flex items-center gap-2 md:gap-4 group shrink-0">
                  <div className="hidden sm:flex flex-col items-end mr-1 text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{user.name}</span>
                    <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight opacity-80">Pet Parent</span>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-[18px] bg-[#4F46E5] flex items-center justify-center text-white font-black text-lg overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg group-hover:scale-110 transition-transform">
                    {user.image ? <img src={user.image} alt={user.name.charAt(0)} className="w-full h-full object-cover" /> : <span>{user.name.charAt(0).toUpperCase()}</span>}
                  </div>
                </Link>
              )}
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                  className="p-2.5 md:p-3.5 rounded-[16px] md:rounded-[20px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm border border-gray-300 dark:border-gray-700"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Mobile Menu Toggle Button */}
                <button 
                  onClick={toggleMenu} 
                  className="xl:hidden p-2.5 md:p-3 rounded-[16px] md:rounded-[20px] text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 active:scale-95 transition-all"
                  aria-label="Toggle Menu"
                >
                  {isOpen ? <X size={24} className="text-paws-pink" /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu Overlay - Fixed positioning outside nav flex container */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 top-0 pt-20 bg-white/98 dark:bg-[#0F172A]/98 backdrop-blur-2xl z-[105] animate-fade-in overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
            <div className="flex items-center justify-between px-4 mb-4">
                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] italic">Explore Pawsitivity</h3>
                <Sparkles size={16} className="text-yellow-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-24">
              {[...primaryNavItems, ...secondaryNavItems].map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`block px-8 py-6 rounded-[32px] text-xl font-black flex items-center gap-6 border transition-all ${isActive(item.path) ? 'text-[#0D9488] bg-teal-50 border-teal-100 shadow-xl scale-[1.02]' : 'text-gray-700 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-transparent hover:bg-gray-100 shadow-md'}`}
                >
                  <div className={`${isActive(item.path) ? 'text-teal-600 scale-110' : 'text-gray-400'} transition-transform`}>{item.icon}</div>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;