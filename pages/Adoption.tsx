import React, { useState, useEffect } from 'react';
import { Search, MapPin, Plus, Phone, ShieldCheck, X, Camera, HeartHandshake, Loader2, AlertCircle } from 'lucide-react';
import { AdoptionListing } from '../types';
import { MOCK_ADOPTIONS } from '../constants';
import { validateContent } from '../services/geminiService';

const Adoption: React.FC = () => {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [filterType, setFilterType] = useState<'All' | 'Dog' | 'Cat' | 'Fish' | 'Bird' | 'Rabbit' | 'Hamster' | 'Turtle' | 'Other'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<AdoptionListing | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  
  const [newListing, setNewListing] = useState<Partial<AdoptionListing>>({
    name: '', type: 'Dog', breed: '', age: '', gender: 'Male', location: '', contactName: '', contactPhone: '', description: '', vaccinated: false, neutered: false, adoptionFee: 0
  });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('adoptionListings');
    if (saved) { setListings(JSON.parse(saved)); }
    else { setListings(MOCK_ADOPTIONS); localStorage.setItem('adoptionListings', JSON.stringify(MOCK_ADOPTIONS)); }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setPreview(res);
        setNewListing(prev => ({ ...prev, image: res }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setModerationError(null);
    if (!newListing.name || !newListing.breed || !newListing.location || !newListing.contactName || !newListing.contactPhone) {
        alert("Fill in all required fields."); return;
    }
    setIsValidating(true);
    const validation = await validateContent(`Adoption: ${newListing.name}`, newListing.description || '');
    if (!validation.isSafe) { setModerationError(validation.reason || "Content flagged."); setIsValidating(false); return; }
    const listing: AdoptionListing = {
        id: Date.now().toString(), name: newListing.name!, type: newListing.type as any || 'Dog', breed: newListing.breed!, gender: newListing.gender as any || 'Male', age: newListing.age || 'Unknown', location: newListing.location!, vaccinated: Boolean(newListing.vaccinated), neutered: Boolean(newListing.neutered), description: newListing.description || 'No description.', image: newListing.image || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80`, contactName: newListing.contactName!, contactPhone: newListing.contactPhone!, adoptionFee: Number(newListing.adoptionFee || 0), postedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [listing, ...listings];
    setListings(updated);
    localStorage.setItem('adoptionListings', JSON.stringify(updated));
    setIsAddModalOpen(false); setIsValidating(false); setPreview(null);
  };

  const filteredListings = listings.filter(item => {
    const mType = filterType === 'All' || item.type === filterType;
    const mSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return mType && mSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-gradient-to-br from-[#136E6E] via-[#4F46E5] to-[#E11D48] text-white py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="max-w-[1500px] mx-auto relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="lg:w-2/3 text-center lg:text-left">
                <h1 className="text-5xl md:text-8xl font-black mb-6 italic tracking-tighter leading-none">Adopt, Don't Shop <HeartHandshake size={64} className="inline-block text-yellow-300 ml-2 animate-pulse" /></h1>
                <p className="text-xl md:text-3xl font-bold text-white/90 max-w-2xl mx-auto lg:mx-0 leading-tight">Give a forever home to a furry friend. Vetted listings from across India.</p>
            </div>
            <button onClick={() => { setModerationError(null); setIsAddModalOpen(true); }} className="bg-white text-[#136E6E] font-black py-5 px-14 rounded-[32px] shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-sm italic mx-auto lg:mx-0">List a Pet</button>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full lg:w-auto p-2 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-300 dark:border-gray-700">
                {['All', 'Dog', 'Cat', 'Bird', 'Rabbit'].map((type) => (
                    <button key={type} onClick={() => setFilterType(type as any)} className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === type ? 'bg-[#136E6E] text-white shadow-xl scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}>{type}</button>
                ))}
            </div>
            <div className="relative w-full lg:w-[450px] group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#136E6E] transition-colors" size={20} />
                <input placeholder="Search area, breed, or name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-transparent rounded-[32px] font-bold dark:text-white outline-none focus:ring-4 focus:ring-[#136E6E]/10 shadow-inner transition-all placeholder-gray-500" />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredListings.map(pet => (
                <div key={pet.id} onClick={() => setSelectedPet(pet)} className="bg-white dark:bg-gray-800 rounded-[56px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer animate-fade-in-down flex flex-col h-full">
                    <div className="h-72 relative overflow-hidden shrink-0">
                        <img src={pet.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={pet.name} />
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black uppercase text-gray-800 shadow-xl border border-gray-200"><MapPin size={12} className="inline mr-1 text-red-500" /> {pet.location}</div>
                        <div className="absolute bottom-6 right-6 bg-[#136E6E] text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">{pet.type}</div>
                    </div>
                    <div className="p-10 flex flex-col flex-1">
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 italic tracking-tighter truncate">{pet.name}</h3>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-10">{pet.breed} • {pet.age}</p>
                        <button className="mt-auto w-full py-5 rounded-[28px] bg-gray-100 dark:bg-gray-900/50 text-[#136E6E] dark:text-teal-400 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#136E6E] hover:text-white transition-all shadow-sm border border-gray-200 dark:border-transparent">Details</button>
                    </div>
                </div>
            ))}
        </div>
        {filteredListings.length === 0 && (
          <div className="py-40 text-center opacity-20 italic">
              <Search size={80} className="mx-auto mb-6 text-gray-300" />
              <p className="text-4xl font-black uppercase tracking-tighter">No buddies found</p>
          </div>
        )}
      </div>

      {/* ADD LISTING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setIsAddModalOpen(false)}>
          <div className="flex min-h-full items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 rounded-[64px] w-full max-w-3xl p-10 md:p-16 shadow-2xl relative border border-gray-300 dark:border-gray-700 my-8" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">List Pet</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-3xl hover:text-paws-rose transition-all shadow-inner"><X size={32} className="text-gray-500" /></button>
                </div>
                {moderationError && <div className="bg-red-50 p-6 rounded-[32px] mb-10 flex gap-4 text-red-600 font-black text-xs italic border border-red-200"><AlertCircle size={24} className="shrink-0" /> {moderationError}</div>}
                <form onSubmit={handleSubmitListing} className="space-y-8">
                    <div className="flex flex-col items-center gap-6 mb-10">
                        <div className="w-36 h-36 bg-gray-100 dark:bg-gray-700 rounded-[48px] overflow-hidden flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-600 shadow-inner group transition-all hover:border-[#136E6E]/50">
                            {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : <Camera size={48} className="text-gray-400" />}
                        </div>
                        <label className="bg-teal-50 text-[#136E6E] font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest cursor-pointer hover:bg-teal-100 shadow-sm border border-teal-200 transition-all">Add Pet Photo <input type="file" onChange={handleImageChange} className="hidden" /></label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4">Pet Name</label>
                            <input required placeholder="Bruno, Mimi..." value={newListing.name} onChange={e => setNewListing({...newListing, name: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 shadow-inner placeholder-gray-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4">Breed</label>
                            <input required placeholder="Indie, Persian Mix..." value={newListing.breed} onChange={e => setNewListing({...newListing, breed: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 shadow-inner placeholder-gray-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <select value={newListing.type} onChange={e => setNewListing({...newListing, type: e.target.value as any})} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 shadow-inner"><option value="Dog">Dog</option><option value="Cat">Cat</option><option value="Rabbit">Rabbit</option></select>
                        <select value={newListing.gender} onChange={e => setNewListing({...newListing, gender: e.target.value as any})} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 shadow-inner"><option value="Male">Male</option><option value="Female">Female</option></select>
                        <input required placeholder="Age (e.g. 1 Year)" value={newListing.age} onChange={e => setNewListing({...newListing, age: e.target.value})} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white shadow-inner placeholder-gray-500" />
                        <input type="number" placeholder="Fee ₹" value={newListing.adoptionFee || ''} onChange={e => setNewListing({...newListing, adoptionFee: Number(e.target.value)})} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white shadow-inner placeholder-gray-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-4">Location</label>
                        <input required placeholder="City or Area (e.g. South Delhi)" value={newListing.location} onChange={e => setNewListing({...newListing, location: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 shadow-inner placeholder-gray-500" />
                    </div>
                    <textarea required placeholder="Tell us about the pet's personality and why they're looking for a home..." rows={5} value={newListing.description} onChange={e => setNewListing({...newListing, description: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[32px] p-8 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/10 resize-none shadow-inner placeholder-gray-500" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-gray-300 dark:border-gray-700">
                        <input required placeholder="Your Name" value={newListing.contactName} onChange={e => setNewListing({...newListing, contactName: e.target.value})} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white shadow-inner placeholder-gray-500" />
                        <input required placeholder="Phone Number" value={newListing.contactPhone} onChange={e => setNewListing({...newListing, contactPhone: e.target.value})} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-transparent rounded-[28px] p-6 font-bold dark:text-white shadow-inner placeholder-gray-500" />
                    </div>
                    <button type="submit" disabled={isValidating} className="w-full bg-[#136E6E] text-white font-black py-7 rounded-[48px] shadow-2xl active:scale-95 transition-all mt-10 uppercase tracking-[0.2em] text-sm italic border-b-8 border-[#0B4444] disabled:opacity-50">
                        {isValidating ? <><Loader2 className="animate-spin inline mr-3" size={24} /> Validating...</> : 'Broadcast Listing'}
                    </button>
                </form>
            </div>
          </div>
        </div>
      )}

      {/* PET DETAILS MODAL */}
      {selectedPet && (
          <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedPet(null)}>
            <div className="flex min-h-full items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-800 rounded-[64px] w-full max-w-3xl overflow-hidden shadow-2xl relative border border-gray-300 dark:border-gray-700 my-8" onClick={e => e.stopPropagation()}>
                    <div className="relative h-[450px] md:h-[550px]">
                        <img src={selectedPet.image} alt={selectedPet.name} className="w-full h-full object-cover" />
                        <button onClick={() => setSelectedPet(null)} className="absolute top-8 right-8 bg-black/50 text-white p-4 rounded-full backdrop-blur-md hover:bg-black/70 transition-all z-10 hover:scale-110"><X size={32} /></button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-12 md:p-16">
                            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4">{selectedPet.name}</h2>
                            <div className="flex flex-wrap gap-4">
                                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">{selectedPet.breed}</span>
                                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">{selectedPet.age}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-12 md:p-16 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-teal-50 dark:bg-teal-900/20 p-8 rounded-[36px] border-2 border-teal-200 dark:border-teal-800 flex items-center gap-5 shadow-sm">
                                <ShieldCheck className="text-[#136E6E] dark:text-teal-400" size={32}/>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#136E6E] dark:text-teal-200 leading-tight">{selectedPet.vaccinated ? 'Fully Vaccinated' : 'Vaccination Pending'}</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700/50 p-8 rounded-[36px] border-2 border-gray-300 dark:border-gray-600 flex items-center gap-5 shadow-sm">
                                <MapPin className="text-red-500" size={32}/>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-300 leading-tight">{selectedPet.location}</p>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[36px] border-2 border-indigo-200 dark:border-indigo-800 flex items-center gap-5 shadow-sm">
                                <Phone className="text-[#4F46E5]" size={32}/>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-800 dark:text-indigo-200 leading-tight">Verified Parent Contact</p>
                            </div>
                        </div>
                        <p className="text-2xl text-gray-800 dark:text-gray-300 font-bold leading-tight italic tracking-tight">"{selectedPet.description}"</p>
                        <div className="pt-12 border-t border-gray-300 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="text-center md:text-left">
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">Adoption Fee</p>
                                <p className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter">₹{selectedPet.adoptionFee || 'Free'}</p>
                            </div>
                            <button onClick={() => alert(`Call ${selectedPet.contactName}: ${selectedPet.contactPhone}`)} className="w-full md:w-auto bg-[#FF4D8D] text-white font-black py-6 px-16 rounded-[40px] shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs italic border-b-8 border-pink-700">Contact Parent</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default Adoption;