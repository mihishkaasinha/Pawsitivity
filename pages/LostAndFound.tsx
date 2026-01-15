
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Share2, X, Camera, AlertTriangle, Loader2, AlertCircle, Sparkles, Megaphone, ShieldAlert } from 'lucide-react';
import { MOCK_LOST_PETS } from '../constants';
import { LostPetReport } from '../types';
import { validateContent } from '../services/geminiService';

const LostAndFound: React.FC = () => {
  const [reports, setReports] = useState<LostPetReport[]>([]);
  const [filterType, setFilterType] = useState<'All' | 'Lost' | 'Found'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  
  const [newReport, setNewReport] = useState<Partial<LostPetReport>>({
    type: 'Lost', status: 'Open', petName: '', breed: '', location: '', date: new Date().toISOString().split('T')[0], contactName: '', contactPhone: '', description: '', reward: 0
  });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pawsLostFound');
    if (saved) { 
        setReports(JSON.parse(saved)); 
    } else { 
        setReports(MOCK_LOST_PETS); 
        localStorage.setItem('pawsLostFound', JSON.stringify(MOCK_LOST_PETS)); 
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModerationError(null);
    setIsValidating(true);
    const validation = await validateContent(`${newReport.type} pet: ${newReport.petName}`, newReport.description || '');
    if (!validation.isSafe) { setModerationError(validation.reason || "Content flagged."); setIsValidating(false); return; }
    const report: LostPetReport = {
        id: Date.now().toString(), 
        type: newReport.type as any, 
        petName: newReport.petName || 'Unknown', 
        petType: 'Dog', 
        breed: newReport.breed || 'Indie', 
        location: newReport.location!, 
        date: newReport.date!, 
        contactName: newReport.contactName!, 
        contactPhone: newReport.contactPhone!, 
        description: newReport.description!, 
        image: newReport.image || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80`, 
        status: 'Open', 
        reward: newReport.reward ? Number(newReport.reward) : undefined
    };
    const updated = [report, ...reports];
    setReports(updated); 
    localStorage.setItem('pawsLostFound', JSON.stringify(updated));
    setIsValidating(false); setIsModalOpen(false); setPreview(null);
  };

  const filtered = reports.filter(r => {
    const tMatch = filterType === 'All' || r.type === filterType;
    const sMatch = r.petName.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return tMatch && sMatch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 animate-fade-in">
      {/* Redesigned Modern Header */}
      <div className="relative rounded-[48px] overflow-hidden mb-12 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-500 to-orange-400 opacity-95"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 z-10">
              <div className="max-w-2xl text-center md:text-left space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white border border-white/30">
                      <ShieldAlert size={14} className="animate-pulse" /> Community Safety Hub
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none">Emergency <br/><span className="text-yellow-300">Broadcast.</span></h1>
                  <p className="text-xl md:text-2xl font-bold text-red-50 leading-relaxed max-w-lg">Bringing lost pets home, together. Every alert is instantly shared with every neighbor in the pack.</p>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
                  <button onClick={() => { setNewReport({ ...newReport, type: 'Lost' }); setIsModalOpen(true); }} className="bg-white text-red-600 font-black px-12 py-5 rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest italic flex items-center justify-center gap-3">
                    <Megaphone size={20} /> Report Lost
                  </button>
                  <button onClick={() => { setNewReport({ ...newReport, type: 'Found' }); setIsModalOpen(true); }} className="bg-red-800/40 backdrop-blur-md border-2 border-white/30 text-white font-black px-12 py-5 rounded-3xl shadow-xl hover:bg-red-800/60 transition-all text-sm uppercase tracking-widest italic flex items-center justify-center gap-3">
                    <Search size={20} /> Report Found
                  </button>
              </div>
          </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 px-4">
          <div className="flex bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 w-full md:w-auto">
              {['All', 'Lost', 'Found'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setFilterType(t as any)} 
                    className={`flex-1 md:px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${filterType === t ? 'bg-red-600 text-white shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                  >
                    {t}
                  </button>
              ))}
          </div>
          <div className="relative w-full md:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input 
                placeholder="Area, Breed, or Pet Name..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-[32px] py-5 pl-16 pr-8 text-sm font-black dark:text-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none shadow-sm" 
              />
          </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 px-2">
          {filtered.map(r => (
              <div key={r.id} className="bg-white dark:bg-gray-800 rounded-[56px] shadow-sm border-2 border-gray-50 dark:border-gray-700 overflow-hidden hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 group animate-fade-in-down flex flex-col h-full">
                  <div className="h-80 md:h-96 relative overflow-hidden bg-gray-100 dark:bg-gray-900 shrink-0">
                      <img 
                        src={r.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        alt={r.petName} 
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className={`absolute top-8 left-8 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl backdrop-blur-md border border-white/20 ${r.type === 'Lost' ? 'bg-red-600' : 'bg-green-600'}`}>
                        {r.type} Alert
                      </div>
                      {r.reward && (
                         <div className="absolute bottom-8 right-8 bg-yellow-400 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border-2 border-white animate-bounce">
                           ₹{r.reward} Reward
                         </div>
                      )}
                  </div>
                  <div className="p-10 flex flex-col flex-1">
                      <div className="mb-6">
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 italic tracking-tight truncate leading-tight">{r.petName}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{r.breed} • {r.date}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 mb-8 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-600">
                        <MapPin size={20} className="text-red-500 shrink-0" /> 
                        <span className="truncate">{r.location}</span>
                      </div>
                      <div className="mt-auto flex gap-4">
                        <a href={`tel:${r.contactPhone}`} className="flex-1 bg-red-600 text-white font-black py-5 rounded-[28px] text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 hover:shadow-xl active:scale-95 transition-all">
                          <Phone size={16} /> Contact Parent
                        </a>
                      </div>
                  </div>
              </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-40 text-center opacity-30 italic">
              <Sparkles className="mx-auto mb-6 text-gray-300" size={80} />
              <p className="text-4xl font-black">Safety Hub is Clear.</p>
              <p className="mt-2 text-xl font-bold">No reports in this category.</p>
            </div>
          )}
      </div>

      {/* ALERT MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)}>
              <div className="flex min-h-full items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-[56px] w-full max-w-xl p-10 md:p-16 shadow-2xl my-8 border border-gray-100 dark:border-gray-700 relative" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setIsModalOpen(false)} className="absolute top-12 right-12 text-gray-400 hover:text-red-500 transition-all p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full">
                        <X size={32} />
                      </button>
                      
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-12 italic tracking-tighter leading-none uppercase">Post {newReport.type} Alert</h2>
                      
                      {moderationError && <div className="bg-red-50 p-6 rounded-[32px] mb-10 flex gap-4 text-red-600 font-black text-xs italic border border-red-100"><AlertCircle size={24} className="shrink-0" /> {moderationError}</div>}
                      
                      <form onSubmit={handleSubmit} className="space-y-8">
                          <div className="flex flex-col items-center gap-6 mb-10">
                            <div className="w-36 h-36 bg-gray-50 dark:bg-gray-700 rounded-[48px] overflow-hidden flex items-center justify-center border-4 border-dashed border-gray-100 dark:border-gray-600 shadow-inner group transition-all hover:border-red-500/50">
                                {preview ? <img src={preview} className="w-full h-full object-cover" /> : <Camera size={48} className="text-gray-300" />}
                            </div>
                            <label className="bg-red-50 text-red-600 font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest cursor-pointer hover:bg-red-100 transition-all shadow-sm border border-red-100">
                              Upload Photo <input type="file" onChange={e => { const f=e.target.files?.[0]; if(f){const r=new FileReader(); r.onloadend=()=>{setPreview(r.result as string); setNewReport(p=>({...p, image:r.result as string}))}; r.readAsDataURL(f);}}} className="hidden" />
                            </label>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Pet Name</label>
                                <input required placeholder="Snowy, Bruno..." value={newReport.petName} onChange={e => setNewReport({...newReport, petName: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[28px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-red-500/10" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Breed</label>
                                <input required placeholder="Golden Retriever, Indie..." value={newReport.breed} onChange={e => setNewReport({...newReport, breed: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[28px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-red-500/10" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Last Seen / Found Location</label>
                            <input required placeholder="Exact area, landmarks, sector..." value={newReport.location} onChange={e => setNewReport({...newReport, location: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[28px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-red-500/10 shadow-inner" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Description</label>
                            <textarea required placeholder="Collar color, behavior, distinguishing marks..." rows={4} value={newReport.description} onChange={e => setNewReport({...newReport, description: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[28px] p-6 font-bold dark:text-white resize-none focus:ring-4 focus:ring-red-500/10" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100 dark:border-gray-700">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Your Name</label>
                                <input required placeholder="Amit, Priya..." value={newReport.contactName} onChange={e => setNewReport({...newReport, contactName: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[28px] p-6 font-bold dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Phone</label>
                                <input required placeholder="+91" value={newReport.contactPhone} onChange={e => setNewReport({...newReport, contactPhone: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-[28px] p-6 font-bold dark:text-white" />
                            </div>
                          </div>

                          <button type="submit" disabled={isValidating} className="w-full bg-red-600 text-white font-black py-7 rounded-[40px] shadow-2xl hover:bg-red-700 active:scale-95 transition-all mt-8 uppercase tracking-widest text-sm italic border-b-8 border-red-800">
                              {isValidating ? <><Loader2 className="animate-spin inline-block mr-2" size={24} /> Verifying Broadcast...</> : 'Launch Emergency Alert'}
                          </button>
                      </form>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LostAndFound;
