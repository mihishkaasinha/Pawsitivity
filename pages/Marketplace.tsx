import React, { useState } from 'react';
import { Search, MapPin, Star, ShieldCheck, Filter, Calendar, Briefcase, ChevronRight, Check } from 'lucide-react';
import { MOCK_SITTERS } from '../constants';

const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Sitters');

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl font-extrabold mb-4">Trusted Pet Care Services 🐾</h1>
              <p className="text-indigo-100 text-lg">Book verified sitters, walkers, and trainers in your neighborhood. Guaranteed safety and love for your pets.</p>
          </div>
          <Briefcase size={120} className="absolute right-0 bottom-0 text-white opacity-10 transform translate-x-10 translate-y-10" />
      </div>

      <div className="flex gap-4 mb-8 border-b dark:border-gray-700">
          {['Sitters', 'Walkers', 'Trainers', 'Groomers'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-400'}`}
              >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
              </button>
          ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 space-y-6 shrink-0">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><Filter size={18} /> Filters</h3>
                  <div className="space-y-4">
                      <div className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4 rounded text-blue-600" defaultChecked />
                          <span className="text-sm dark:text-gray-300">Verified Only</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                          <span className="text-sm dark:text-gray-300">Instant Book</span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Sitter Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_SITTERS.map(s => (
                  <div key={s.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all flex gap-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-lg dark:text-white flex items-center gap-1">
                                  {s.name} {s.verified && <ShieldCheck size={16} className="text-blue-500" />}
                              </h3>
                              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded text-yellow-600 text-xs font-bold">
                                  <Star size={12} fill="currentColor" /> {s.rating}
                              </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><MapPin size={12} /> {s.location}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                              {s.services.map(ser => <span key={ser} className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-bold">{ser}</span>)}
                          </div>
                          <div className="flex justify-between items-center mt-4">
                              <span className="text-lg font-bold dark:text-white">₹{s.price}<span className="text-xs text-gray-400 font-normal"> /hr</span></span>
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1">
                                  Book Now <ChevronRight size={14} />
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Marketplace;