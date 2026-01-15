import React from 'react';
import { Heart, CloudRain, Flower2, Phone, Flame, ArrowLeft, BookOpen, Users, Coffee, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const RainbowBridge: React.FC = () => {
  const navigate = useNavigate();

  // Directory of Aftercare Agencies
  const agencies = [
    { city: 'Mumbai', name: 'Bai Sakarbai Dinshaw Petit Hospital', desc: 'Provides electric cremation for small animals.', contact: '022 2413 7518', type: 'Hospital' },
    { city: 'Delhi', name: 'Nagar Nigam Pet Crematorium', desc: 'Government facility for dignified pet disposal.', contact: '011-23261680', type: 'Public' },
    { city: 'Bangalore', name: 'CUPA Cemetery', desc: 'Peaceful pet burial ground and memorial garden.', contact: '080-22947307', type: 'NGO' },
    { city: 'Pune', name: 'Pet Heavens Pune', desc: 'Comprehensive cremation and prayer services.', contact: '+91 91720 00000', type: 'Private' },
    { city: 'Chennai', name: 'Blue Cross of India', desc: 'Humane pet disposal and aftercare assistance.', contact: '044 2235 4959', type: 'NGO' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24 animate-fade-in">
       <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-paws-pink mb-8 transition-all font-semibold group">
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Safety
      </button>

      {/* Hero */}
      <div className="text-center mb-16 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent rounded-[40px] p-10">
        <div className="inline-flex p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-lg mb-6">
            <CloudRain size={48} className="text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
          The Rainbow Bridge
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed italic font-medium">
          "A place of healing and memory for our beloved companions who have passed on. They never truly leave us; they live forever in our hearts."
        </p>
      </div>

      {/* Immediate Help Section - Helpline numbers prominently displayed */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-8 rounded-[32px] mb-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
              <Phone size={32} className="animate-pulse" />
          </div>
          <div className="flex-1">
              <h2 className="text-xl font-black text-red-700 dark:text-red-400 mb-2">Immediate Aftercare Help</h2>
              <p className="text-sm text-red-600 dark:text-red-300 font-medium mb-4 italic">If your pet has just passed away, please remain calm. Contact these emergency numbers for transport and guidance:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href="tel:1962" className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/40 hover:scale-[1.02] transition-transform">
                     <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">📞</div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-gray-400">Animal Helpline (National)</p>
                        <p className="text-lg font-black text-red-600 dark:text-red-400">1962</p>
                     </div>
                  </a>
                  <div className="flex items-center gap-3 px-5 py-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-red-200">
                     <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold">📍</div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-gray-400">Local Municipality</p>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Search in Dashboard</p>
                     </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Funeral Agencies & Aftercare Directory */}
      <div className="space-y-6 mb-16">
          <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <ShieldCheck className="text-teal-500" /> Aftercare Partners (India)
              </h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
              {agencies.map((agency, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[28px] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-6 text-center md:text-left">
                          <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-teal-50 transition-colors">{agency.city[0]}</div>
                          <div>
                              <div className="flex items-center gap-2 justify-center md:justify-start">
                                  <h3 className="font-bold text-gray-900 dark:text-white">{agency.name}</h3>
                                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm ${agency.type === 'Private' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>{agency.type}</span>
                              </div>
                              <p className="text-xs text-gray-500 font-medium">{agency.city} • {agency.desc}</p>
                          </div>
                      </div>
                      <a href={`tel:${agency.contact}`} className="w-full md:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md">
                          <Phone size={16} /> {agency.contact}
                      </a>
                  </div>
              ))}
          </div>
          <p className="text-[10px] text-center text-gray-400 font-medium px-10">We are continuously updating this list. If you represent an agency or have a recommendation, please contact community support.</p>
      </div>

      {/* Healing Support */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[40px] p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <Flame size={48} className="mx-auto mb-6 text-orange-400 animate-pulse" />
            <h2 className="text-3xl font-black mb-4">A Space for Grief</h2>
            <p className="text-indigo-100 mb-10 max-w-xl mx-auto font-medium leading-relaxed italic">
                "Losing a companion is heart-breaking. Our AI counselor is trained in pet bereavement support and is here 24/7 to listen and provide comfort."
            </p>
            <Link to="/chat" className="inline-flex items-center gap-3 bg-white text-indigo-700 px-10 py-5 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
                <Heart className="text-red-500 fill-current" size={20} />
                Speak with Paw-AI Support
            </Link>
            <Flower2 size={240} className="absolute -left-10 -bottom-10 opacity-10 transform -rotate-12 pointer-events-none" />
      </div>
    </div>
  );
};

export default RainbowBridge;