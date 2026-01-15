import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Shield, MessageCircle, MapPin, Briefcase, Star, Sparkles, Zap, Award, Users } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
        navigate('/dashboard');
    } else {
        navigate('/settings');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Optimized Hero Section */}
      <section className="relative bg-gradient-to-br from-[#136E6E] via-[#4F46E5] to-[#E11D48] text-white pt-20 pb-20 md:pt-36 md:pb-40 px-4 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[140px] animate-pulse-slow -ml-64 -mt-64 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[120px] animate-pulse-slow -mr-32 -mb-32 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="w-full lg:w-3/5 space-y-8 md:space-y-12 text-center lg:text-left">
            {/* Refined "India's Favorite" Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.25em] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/20 transition-all cursor-default">
                <Sparkles size={18} className="text-yellow-300 fill-yellow-300" /> 
                <span className="opacity-90">India's Favorite Pet Hub</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-black leading-[0.9] sm:leading-[0.85] italic tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                Pet Care,<br />
                <span className="text-[#FFD54F]">Reimagined.</span>
              </h1>
              <div className="h-2 w-24 sm:h-3 sm:w-40 bg-[#FFD54F] rounded-full mx-auto lg:mx-0 shadow-lg"></div>
            </div>

            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold max-w-2xl mx-auto lg:mx-0 leading-snug sm:leading-tight text-white/90 tracking-tight">
              An AI-powered ecosystem designed for India's diverse pet families. Get expert advice, community backup, and integrated care.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <button 
                onClick={handleGetStarted}
                className="bg-white text-[#136E6E] font-black py-4 sm:py-5 px-10 sm:px-14 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 hover:bg-teal-50 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer z-20 uppercase tracking-[0.2em] text-xs sm:text-sm italic"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <Link to="/chat" className="bg-white/10 border-2 sm:border-4 border-white/20 backdrop-blur-md text-white font-black py-4 sm:py-5 px-10 sm:px-14 rounded-[32px] hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer z-20 uppercase tracking-[0.2em] text-xs sm:text-sm italic">
                Ask Paw-AI
              </Link>
            </div>
          </div>

          {/* Refined Image & Trusted Badge Section */}
          <div className="w-full lg:w-2/5 flex justify-center relative mt-16 lg:mt-0">
            <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-none">
                {/* Improved Trusted Badge - Capsule Style */}
                <div className="absolute -top-10 lg:-top-16 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 bg-white/95 backdrop-blur-xl px-6 py-4 sm:px-8 sm:py-5 rounded-[32px] sm:rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white flex items-center gap-4 sm:gap-5 z-30 group hover:scale-110 transition-transform cursor-default">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-rose-50 rounded-[18px] sm:rounded-[22px] flex items-center justify-center shadow-inner group-hover:bg-rose-100 transition-colors">
                      <Heart size={24} className="text-[#E11D48] fill-current animate-pulse sm:w-8 sm:h-8" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none mb-1">Pawsitivity</span>
                      <span className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-widest italic leading-none">TRUSTED</span>
                    </div>
                </div>
                
                <div className="relative rounded-[50px] sm:rounded-[70px] md:rounded-[100px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] border-[10px] sm:border-[15px] md:border-[20px] border-white/10 transform -rotate-2 hover:rotate-0 transition-all duration-1000 aspect-[4/5] md:aspect-auto md:h-[600px]">
                  <img 
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=90" 
                    alt="Happy Dog" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-8 bg-[#136E6E] p-6 sm:p-10 rounded-[32px] sm:rounded-[56px] shadow-3xl border-4 sm:border-8 border-white dark:border-gray-800 z-20 hover:scale-110 transition-transform">
                    <Sparkles size={32} className="text-yellow-300 sm:w-12 sm:h-12" />
                </div>
            </div>
          </div>
        </div>
        
        {/* Modern Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none translate-y-1">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60C320 120 1120 120 1440 60V120H0V60Z" className="fill-slate-50 dark:fill-gray-900 transition-colors duration-200"/>
          </svg>
        </div>
      </section>

      {/* Stats Quick Section */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-[1500px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            <div className="text-center space-y-3 group">
                <p className="text-5xl sm:text-6xl md:text-7xl font-black text-[#136E6E] italic tracking-tighter group-hover:scale-110 transition-transform">50K+</p>
                <div className="h-1 w-10 bg-teal-500 mx-auto rounded-full"></div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Happy Pets</p>
            </div>
            <div className="text-center space-y-3 group">
                <p className="text-5xl sm:text-6xl md:text-7xl font-black text-[#4F46E5] italic tracking-tighter group-hover:scale-110 transition-transform">1200</p>
                <div className="h-1 w-10 bg-indigo-500 mx-auto rounded-full"></div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Verified Vets</p>
            </div>
            <div className="text-center space-y-3 group">
                <p className="text-5xl sm:text-6xl md:text-7xl font-black text-[#E11D48] italic tracking-tighter group-hover:scale-110 transition-transform">15+</p>
                <div className="h-1 w-10 bg-rose-500 mx-auto rounded-full"></div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Indian Cities</p>
            </div>
            <div className="text-center space-y-3 group">
                <p className="text-5xl sm:text-6xl md:text-7xl font-black text-[#7C3AED] italic tracking-tighter group-hover:scale-110 transition-transform">24/7</p>
                <div className="h-1 w-10 bg-violet-500 mx-auto rounded-full"></div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">AI Support</p>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-40 px-4 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24 sm:mb-32 space-y-6 px-4">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">The Complete <br/><span className="text-[#136E6E]">Ecosystem.</span></h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl leading-relaxed mt-8 sm:mt-10">Integrated features designed to elevate the life of every pet and their human companion across India.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
            <FeatureCard 
              icon={<MessageCircle size={48} className="text-white" />}
              title="Paw-AI Vet"
              desc="Instant expert advice tailored for the Indian climate and breeds."
              color="bg-[#3B82F6]"
              accentColor="bg-slate-50 dark:bg-gray-800"
            />
             <FeatureCard 
              icon={<Heart size={48} className="text-white" />}
              title="Health Vault"
              desc="Automatic vaccine reminders and detailed medical history logs."
              color="bg-[#E11D48]"
              accentColor="bg-slate-50 dark:bg-gray-800"
            />
             <FeatureCard 
              icon={<Briefcase size={48} className="text-white" />}
              title="Pro Services"
              desc="Verified local sitters, walkers, and trainers vetted for safety."
              color="bg-[#136E6E]"
              accentColor="bg-slate-50 dark:bg-gray-800"
            />
             <FeatureCard 
              icon={<Shield size={48} className="text-white" />}
              title="Care Circles"
              desc="Secure neighbor networks for emergency backup and shared duties."
              color="bg-[#7C3AED]"
              accentColor="bg-slate-50 dark:bg-gray-800"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, desc: string, color: string, accentColor: string}> = ({icon, title, desc, color, accentColor}) => (
  <div className={`p-10 sm:p-12 rounded-[50px] sm:rounded-[60px] shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all border border-gray-50 dark:border-gray-700 flex flex-col items-center text-center group hover:-translate-y-6 ${accentColor}`}>
    <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-[30px] sm:rounded-[36px] ${color} flex items-center justify-center mb-8 sm:mb-12 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all`}>
      {icon}
    </div>
    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 italic tracking-tight uppercase">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm sm:text-base leading-relaxed">{desc}</p>
  </div>
);

export default Home;