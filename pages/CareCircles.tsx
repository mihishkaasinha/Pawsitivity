import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Users, Plus, Calendar, MapPin, MessageSquare, ChevronRight, Lock, Heart, X, BellRing, Info, Loader2 } from 'lucide-react';
import { MOCK_CARE_CIRCLES } from '../constants';
import { CareCircle } from '../types';

const CareCircles: React.FC = () => {
  const [circles, setCircles] = useState<CareCircle[]>([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeSOS, setActiveSOS] = useState<string | null>(null);
  const [viewingDashboard, setViewingDashboard] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [newCircleData, setNewCircleData] = useState({
    name: '',
    description: '',
    location: '',
    maxMembers: 10
  });

  useEffect(() => {
    const saved = localStorage.getItem('pawsCareCircles');
    if (saved) {
      setCircles(JSON.parse(saved));
    } else {
      setCircles(MOCK_CARE_CIRCLES);
      localStorage.setItem('pawsCareCircles', JSON.stringify(MOCK_CARE_CIRCLES));
    }
  }, []);

  const handlePanic = (circleName: string) => {
    setActiveSOS(circleName);
  };

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // Simulate network delay
    setTimeout(() => {
      const newCircle: CareCircle = {
        id: `c${Date.now()}`,
        name: newCircleData.name,
        description: newCircleData.description,
        location: newCircleData.location,
        members: 1,
        maxMembers: newCircleData.maxMembers,
        emergencyActive: false
      };

      const updated = [newCircle, ...circles];
      setCircles(updated);
      localStorage.setItem('pawsCareCircles', JSON.stringify(updated));
      
      setIsCreating(false);
      setIsCreateModalOpen(false);
      setNewCircleData({ name: '', description: '', location: '', maxMembers: 10 });
      alert(`Success! "${newCircle.name}" has been created. Invite your neighbors using code: ${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 to-paws-pink rounded-[40px] p-8 md:p-12 text-white mb-10 relative overflow-hidden shadow-2xl animate-fade-in">
          <div className="relative z-10">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block border border-white/30">Trusted Support</span>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-white">Care Circles. <br/>Neighborhood Backup.</h1>
              <p className="text-teal-50 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed opacity-90">
                  Private networks of 5-10 trusted neighbors. Emergencies, key swaps, and walking rotations — handled together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-white text-teal-600 font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                  >
                      <Plus size={20} /> Create Circle
                  </button>
                  <button onClick={() => setIsJoinModalOpen(true)} className="bg-teal-500/30 backdrop-blur-md border-2 border-white/40 text-white font-black px-8 py-4 rounded-2xl hover:bg-teal-500/50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                      <Users size={20} /> Join with Code
                  </button>
              </div>
          </div>
          <ShieldCheck size={280} className="absolute -right-20 -bottom-20 text-white opacity-10 transform -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 px-2 italic">
                  Active Circles <span className="bg-teal-100 text-teal-600 text-xs px-2.5 py-1 rounded-full font-bold">{circles.length}</span>
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                  {circles.map(circle => (
                      <div key={circle.id} className="bg-white dark:bg-gray-800 rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden">
                          {circle.emergencyActive && (
                              <div className="absolute top-0 right-0 bg-red-500 text-white px-6 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                                  <BellRing size={12} /> SOS Active
                              </div>
                          )}
                          
                          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                              <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic">{circle.name}</h3>
                                      <Lock size={16} className="text-gray-300" />
                                  </div>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-lg font-medium">"{circle.description}"</p>
                                  
                                  <div className="flex flex-wrap gap-4 mb-8">
                                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-xl">
                                          <Users size={16} className="text-paws-pink" />
                                          {circle.members}/{circle.maxMembers} Members
                                      </div>
                                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-xl">
                                          <MapPin size={16} className="text-teal-500" />
                                          {circle.location}
                                      </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                      <button 
                                        onClick={() => setViewingDashboard(circle.name)}
                                        className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg uppercase tracking-widest text-[10px]"
                                      >
                                          Circle Dashboard <ChevronRight size={16} />
                                      </button>
                                      <button className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 p-4 rounded-2xl hover:bg-teal-100 transition-all border border-teal-100 dark:border-teal-800 active:scale-90">
                                          <MessageSquare size={20} />
                                      </button>
                                  </div>
                              </div>
                              
                              <div className="w-full md:w-64 space-y-4 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 md:pl-6">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Neighborhood Actions</h4>
                                  <button onClick={() => alert("Duty request sent to neighbors!")} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-bold text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-100">
                                      <span className="flex items-center gap-3"><Calendar size={18} className="text-paws-pink" /> Request Visit</span>
                                      <ChevronRight size={14} className="text-gray-300" />
                                  </button>
                                  <button 
                                    onClick={() => handlePanic(circle.name)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 transition-all text-sm font-black text-red-600 border border-red-100 dark:border-red-900/50 hover:shadow-md hover:scale-[1.02] active:scale-95"
                                  >
                                      <span className="flex items-center gap-3"><AlertCircle size={18} /> SOS Panic Button</span>
                                      <ChevronRight size={14} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 bg-paws-pink/10 rounded-2xl flex items-center justify-center text-paws-pink mb-6 shadow-inner">
                      <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 italic">How it works</h3>
                  <div className="space-y-4">
                      <div className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 shrink-0 text-xs font-black">1</div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"><span className="font-bold text-gray-800 dark:text-white">Emergency Backup:</span> Notify neighbors who have your house keys instantly during travel.</p>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 shrink-0 text-xs font-black">2</div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"><span className="font-bold text-gray-800 dark:text-white">Shared Duties:</span> Swap walking duties when you're late from work or stuck in traffic.</p>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 shrink-0 text-xs font-black">3</div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"><span className="font-bold text-gray-800 dark:text-white">Local Vetting:</span> Neighbors vouch for trusted local sitters and walkers for 100% peace of mind.</p>
                      </div>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
                  <h3 className="text-2xl font-black mb-2 relative z-10 italic">Karma Multiplier 💎</h3>
                  <p className="text-indigo-100 text-sm mb-6 relative z-10 leading-relaxed font-medium opacity-90">Helping Circle members earns you 5x bonus points and the "Trusted Neighbor" badge.</p>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 font-black shadow-inner">L</div>
                      <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Current Tier</p>
                          <p className="font-black">Neighborhood Legend</p>
                      </div>
                  </div>
                  <Heart size={100} className="absolute -right-5 -bottom-5 opacity-10 group-hover:scale-125 transition-transform" />
              </div>
          </div>
      </div>
      
      {/* Create Circle Modal */}
      {isCreateModalOpen && (
          <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsCreateModalOpen(false)}>
              <div className="flex min-h-full items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-[48px] w-full max-w-lg p-10 md:p-12 shadow-2xl relative border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-10 right-10 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-all"><X size={28} /></button>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-10 italic tracking-tighter uppercase">Assemble Circle</h2>
                      
                      <form onSubmit={handleCreateCircle} className="space-y-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Circle Name</label>
                              <input 
                                required 
                                value={newCircleData.name}
                                onChange={e => setNewCircleData({...newCircleData, name: e.target.value})}
                                placeholder="e.g. Indiranagar Paws Patrol" 
                                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-3xl p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 text-lg shadow-inner" 
                              />
                          </div>

                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Mission Description</label>
                              <textarea 
                                required 
                                rows={3}
                                value={newCircleData.description}
                                onChange={e => setNewCircleData({...newCircleData, description: e.target.value})}
                                placeholder="Backup for emergencies, food swaps, and neighborhood safety..." 
                                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-3xl p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 resize-none shadow-inner" 
                              />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Area / Locality</label>
                                  <input 
                                    required 
                                    value={newCircleData.location}
                                    onChange={e => setNewCircleData({...newCircleData, location: e.target.value})}
                                    placeholder="e.g. Bangalore" 
                                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-3xl p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 shadow-inner" 
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Size Limit</label>
                                  <select 
                                    value={newCircleData.maxMembers}
                                    onChange={e => setNewCircleData({...newCircleData, maxMembers: parseInt(e.target.value)})}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-3xl p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 cursor-pointer shadow-inner"
                                  >
                                      <option value={5}>5 Members</option>
                                      <option value={10}>10 Members</option>
                                      <option value={15}>15 Members</option>
                                  </select>
                              </div>
                          </div>

                          <button 
                            type="submit" 
                            disabled={isCreating}
                            className="w-full bg-teal-600 text-white font-black py-6 rounded-[32px] shadow-2xl hover:bg-teal-700 active:scale-95 transition-all uppercase tracking-widest text-sm italic mt-4"
                          >
                              {isCreating ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Establish Circle'}
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {/* SOS Feedback Modal */}
      {activeSOS && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-red-600/90 backdrop-blur-lg animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-[40px] w-full max-w-md p-10 text-center relative shadow-2xl scale-100">
                  <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-8 animate-bounce shadow-inner">
                      <BellRing size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic">Panic Triggered!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 font-bold leading-relaxed">An emergency alert has been sent to all members of <span className="text-red-500 underline underline-offset-4 font-black">{activeSOS}</span>. They are being notified to call or check on you immediately.</p>
                  <button 
                    onClick={() => setActiveSOS(null)}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
                  >
                      I'm Safe / Cancel Alert
                  </button>
              </div>
          </div>
      )}

      {/* Circle Dashboard Modal - Detailed View */}
      {viewingDashboard && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setViewingDashboard(null)}>
              <div className="bg-white dark:bg-gray-800 rounded-[40px] w-full max-w-2xl h-[80vh] flex flex-col relative shadow-2xl border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setViewingDashboard(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-all hover:scale-110 p-2">
                      <X size={28} />
                  </button>
                  
                  <div className="p-10 pb-4">
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 italic tracking-tight">
                        {viewingDashboard} <ShieldCheck className="text-teal-500" />
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">Active Monitoring • Neighborhood Watch Engaged</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 pt-4 space-y-8 scrollbar-hide">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-3xl border border-teal-100 dark:border-teal-800 shadow-inner">
                              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Visits Today</p>
                              <p className="text-2xl font-black text-gray-900 dark:text-white italic">4 Pending</p>
                          </div>
                           <div className="bg-paws-pink/10 dark:bg-paws-pink/20 p-6 rounded-3xl border border-paws-pink/20 shadow-inner">
                              <p className="text-[10px] font-black text-paws-pink uppercase tracking-widest mb-1">Key Swap Status</p>
                              <p className="text-2xl font-black text-gray-900 dark:text-white italic">Secure</p>
                          </div>
                      </div>

                      <div>
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              Live Feed <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          </h4>
                          <div className="space-y-4">
                              {[
                                { user: 'Simran K', act: 'Checked on Sheru (Indie)', time: '12 mins ago', icon: '🐾' },
                                { user: 'Rahul V', act: 'Fed Max (Labrador)', time: '1 hour ago', icon: '🦴' },
                                { user: 'Anita R', act: 'Watered plants & checked keys', time: '3 hours ago', icon: '🔑' }
                              ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-transparent hover:border-teal-100 transition-colors">
                                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-600 font-black flex items-center justify-center text-xl shadow-sm border border-gray-100 dark:border-gray-500">{item.icon}</div>
                                      <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold dark:text-white truncate"><span className="text-paws-pink italic">{item.user}</span> {item.act}</p>
                                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{item.time}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Join Modal - Enter Code */}
      {isJoinModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in" onClick={() => setIsJoinModalOpen(false)}>
              <div className="bg-white dark:bg-gray-800 rounded-[40px] w-full max-w-md p-10 text-center relative shadow-2xl border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 p-2"><X size={24} /></button>
                  <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 rounded-3xl flex items-center justify-center text-teal-600 mx-auto mb-8 shadow-inner">
                      <Users size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight italic uppercase">Join Circle</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 font-bold text-sm">Enter the 6-digit access code shared by your trusted neighbor.</p>
                  <div className="flex gap-2 justify-center mb-8">
                      {[1,2,3,4,5,6].map(i => (
                          <input key={i} maxLength={1} className="w-11 h-16 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl text-center text-2xl font-black dark:text-white focus:ring-4 focus:ring-paws-pink/20 shadow-inner" />
                      ))}
                  </div>
                  <button onClick={() => {alert("Membership request sent!"); setIsJoinModalOpen(false);}} className="w-full bg-paws-pink text-white font-black py-5 rounded-2xl shadow-xl hover:bg-teal-600 transition-all active:scale-95 text-sm uppercase tracking-widest">Verify & Enter</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CareCircles;