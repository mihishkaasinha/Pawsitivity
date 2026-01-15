import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, Gift, Heart, MapPin, Clock, Plus, Filter, MessageCircle } from 'lucide-react';
import { MOCK_HELP_REQUESTS } from '../constants';

const HelpBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 pb-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
          Community Help Board <HelpCircle className="text-teal-500" />
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Give back to the community or request help from neighbors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-red-500 transition-all text-center group">
              <AlertTriangle className="mx-auto mb-2 text-red-500 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold dark:text-white">Request Urgent Help</h3>
              <p className="text-xs text-gray-400">Medical emergencies, lost pets</p>
          </button>
          <button className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-center group">
              <HelpCircle className="mx-auto mb-2 text-blue-500 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold dark:text-white">Ask for Advice</h3>
              <p className="text-xs text-gray-400">Training, recommendations</p>
          </button>
          <button className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-teal-500 transition-all text-center group">
              <Gift className="mx-auto mb-2 text-teal-500 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-bold dark:text-white">Offer Help / Items</h3>
              <p className="text-xs text-gray-400">Donations, transport, time</p>
          </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
          {['All', 'Urgent', 'Health', 'Donation', 'Advice'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === cat ? 'bg-gray-900 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700'}`}
              >
                  {cat}
              </button>
          ))}
      </div>

      <div className="space-y-4">
          {MOCK_HELP_REQUESTS.map(req => (
              <div key={req.id} className={`p-6 rounded-3xl shadow-sm border-l-8 transition-all hover:shadow-md
                ${req.type === 'Urgent' ? 'bg-red-50 dark:bg-red-900/10 border-red-500' : 
                  req.type === 'Offer' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-500' : 'bg-white dark:bg-gray-800 border-blue-500 border'}
              `}>
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white
                            ${req.type === 'Urgent' ? 'bg-red-500' : req.type === 'Offer' ? 'bg-teal-500' : 'bg-blue-500'}`}>
                              {req.type}
                          </span>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{req.title}</h3>
                      </div>
                      <span className="text-xs text-gray-400">{req.timestamp}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm md:text-base">{req.content}</p>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-bold"><MapPin size={12} /> {req.location}</span>
                          <span className="flex items-center gap-1 font-bold"><Heart size={12} /> By {req.author}</span>
                      </div>
                      <button className="w-full md:w-auto px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                          <MessageCircle size={16} /> {req.type === 'Offer' ? 'I Want This' : 'I Can Help'}
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default HelpBoard;