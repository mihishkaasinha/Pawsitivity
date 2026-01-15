import React, { useState } from 'react';
import { Search, MapPin, Star, ShieldCheck, Filter, ChevronRight, Award, Heart, Sparkles, Zap, Shield, Crown, Check } from 'lucide-react';
import { MOCK_SITTERS } from '../constants';

const CareServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Sitters');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState(2000);

  const filteredSitters = MOCK_SITTERS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = s.price <= maxBudget;
    return matchesSearch && matchesBudget;
  });

  const tabColors: Record<string, string> = {
    'Sitters': 'text-paws-teal border-paws-teal bg-paws-teal/5',
    'Walkers': 'text-paws-rose border-paws-rose bg-paws-rose/5',
    'Trainers': 'text-paws-indigo border-paws-indigo bg-paws-indigo/5',
    'Groomers': 'text-paws-violet border-paws-violet bg-paws-violet/5',
    'Daycare': 'text-paws-sky border-paws-sky bg-paws-sky/5',
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-paws-indigo via-paws-teal to-paws-sky rounded-[48px] p-12 md:p-20 text-white mb-16 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/30">
                  <Crown size={14} className="text-yellow-300" /> Premium Professionals
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none text-white italic tracking-tighter">Elite Care. <br/>Local Experts.</h1>
              <p className="text-white/90 text-xl font-bold leading-relaxed max-w-xl">Find verified sitters, trainers, and walkers vetted for India's modern pet parents.</p>
          </div>
          <div className="absolute right-0 bottom-0 text-white opacity-10 transform translate-x-20 translate-y-20 scale-125">
            <Award size={400} />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 md:gap-6 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {['Sitters', 'Walkers', 'Trainers', 'Groomers', 'Daycare'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3.5 rounded-2xl text-xs font-black transition-all border-2 uppercase tracking-widest whitespace-nowrap
                  ${activeTab === tab 
                    ? `shadow-xl scale-105 ${tabColors[tab]}` 
                    : 'text-gray-400 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-10 shrink-0">
              <div className="bg-white dark:bg-[#1E293B] p-10 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                    <Filter size={18} className="text-paws-teal" /> Marketplace Search
                  </h3>
                  
                  <div className="space-y-10">
                      <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-paws-teal transition-colors" size={20} />
                          <input 
                            placeholder="City, Name, Area..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-black dark:text-white ring-2 ring-gray-100 dark:ring-gray-700 focus:ring-4 focus:ring-paws-teal/20 transition-all outline-none"
                          />
                      </div>

                      <div className="space-y-6">
                          <label className="flex items-center gap-4 cursor-pointer group">
                              <div className="relative w-6 h-6 flex items-center justify-center">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 peer-checked:bg-paws-teal transition-colors"></div>
                                <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <span className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest group-hover:text-paws-teal">Pawsitivity Verified</span>
                          </label>
                          <label className="flex items-center gap-4 cursor-pointer group">
                              <div className="relative w-6 h-6 flex items-center justify-center">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 peer-checked:bg-paws-rose transition-colors"></div>
                                <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                              <span className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest group-hover:text-paws-rose">Available Today</span>
                          </label>
                      </div>

                      <div className="pt-8 border-t border-gray-50 dark:border-gray-800">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Budget Range</p>
                          <input 
                            type="range" 
                            min="100" 
                            max="2000" 
                            step="50"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-paws-indigo" 
                          />
                          <div className="flex justify-between text-[10px] font-black text-gray-400 mt-4">
                            <span>₹100</span>
                            <span className="text-paws-indigo font-black bg-paws-indigo/5 px-2 py-1 rounded">Max ₹{maxBudget}</span>
                            <span>₹2000+</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Promo Block */}
              <div className="bg-gradient-to-br from-paws-rose to-paws-orange p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                  <Zap size={100} className="absolute -right-5 -bottom-5 text-white opacity-10 group-hover:scale-125 transition-transform" />
                  <h4 className="text-2xl font-black mb-4 italic leading-tight">FastTrack <br/>Booking</h4>
                  <p className="text-xs font-bold opacity-80 mb-8">Get 10% off your first professional sitter booking.</p>
                  <button className="w-full bg-white text-paws-rose py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">Apply Coupon</button>
              </div>
          </div>

          {/* Sitter Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredSitters.map((s, index) => (
                  <div key={s.id} className={`bg-white dark:bg-[#1E293B] rounded-[48px] shadow-sm border-2 overflow-hidden hover:shadow-2xl transition-all flex flex-col group animate-fade-in-down ${index % 3 === 0 ? 'border-paws-teal/5 hover:border-paws-teal/20' : index % 3 === 1 ? 'border-paws-indigo/5 hover:border-paws-indigo/20' : 'border-paws-violet/5 hover:border-paws-violet/20'}`}>
                      <div className="h-64 relative group overflow-hidden">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                          <div className="absolute top-6 left-6 flex items-center gap-2">
                             <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl text-paws-rose shadow-xl hover:scale-110 transition-transform cursor-pointer"><Heart size={20} fill="currentColor" /></div>
                             <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl text-yellow-500 shadow-xl flex items-center gap-1.5 font-black text-sm">
                                <Star size={16} fill="currentColor" /> {s.rating}
                             </div>
                          </div>
                          {s.verified && (
                             <div className="absolute bottom-6 right-6 bg-paws-teal text-white px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                                <ShieldCheck size={14} /> Verified Pro
                             </div>
                          )}
                      </div>

                      <div className="p-10 flex-1 flex flex-col">
                          <div className="mb-6">
                              <h3 className="font-black text-3xl text-gray-900 dark:text-white mb-2 italic tracking-tight truncate">{s.name}</h3>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2"><MapPin size={14} className="text-paws-rose" /> {s.location}</p>
                          </div>
                          
                          <p className="text-base text-gray-500 dark:text-gray-400 line-clamp-2 mb-8 font-bold italic leading-relaxed">"{s.bio}"</p>
                          
                          <div className="flex flex-wrap gap-2 mb-10">
                              {s.services.map(ser => (
                                <span key={ser} className="text-[9px] bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest shadow-sm group-hover:bg-paws-teal/5 group-hover:text-paws-teal transition-colors">
                                  {ser}
                                </span>
                              ))}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-auto pt-10 border-t border-gray-50 dark:border-gray-800 gap-8">
                              <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Base Hourly Rate</span>
                                  <div className="flex items-baseline gap-1">
                                      <span className="text-4xl font-black text-gray-900 dark:text-white">₹{s.price}</span>
                                      <span className="text-xs font-bold text-gray-400 uppercase">Per Hr</span>
                                  </div>
                              </div>
                              <button onClick={() => alert("Booking request sent!")} className="w-full sm:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-paws-teal hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 hover:scale-105">
                                  Book Session <ChevronRight size={18} />
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
              {filteredSitters.length === 0 && (
                <div className="col-span-full py-40 text-center opacity-40 italic space-y-4">
                    <Search size={64} className="mx-auto text-gray-300" />
                    <p className="text-2xl font-black">No experts found in this area/budget.</p>
                </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default CareServices;