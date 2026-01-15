import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Bell, Calendar, Trash2, X, Check, Clock, ChevronRight, Edit3, AlertTriangle, Lightbulb, Activity, CheckCircle2, User, Filter } from 'lucide-react';
import { INITIAL_PETS, MOCK_REMINDERS } from '../constants';
import { Pet, Reminder, UserProfile } from '../types';

const TIPS = {
  Dog: {
    young: ["Puppies sleep 18-20 hours a day. Ensure they have a quiet corner to rest!", "Start socialization early. Expose your puppy to new sounds and people gently."],
    adult: ["Daily walks are crucial not just for exercise, but for mental stimulation.", "Check paws for ticks and thorns after every walk."],
    senior: ["Senior dogs may need softer bedding to cushion arthritic joints.", "Consider shorter, more frequent walks instead of one long trek."]
  },
  Cat: {
    young: ["Kittens have high energy bursts. interactive play helps bond and tire them out."],
    adult: ["Cats are often lactose intolerant. Avoid cow's milk; stick to fresh water."],
    senior: ["Ramps or steps can help senior cats reach their favorite window spots."]
  },
  Other: ["Fresh water is the most important nutrient for any pet. Change it daily."]
};

const Dashboard: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [smartTip, setSmartTip] = useState<{title: string, text: string}>({ 
    title: 'Welcome to Pawsitivity!', 
    text: 'Add your first pet to receive personalized health and care tips tailored just for them.' 
  });
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', date: '', type: 'Vaccine', petId: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<string | null>(null);

  const [reminderFilterType, setReminderFilterType] = useState('All');

  useEffect(() => {
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) setUser(JSON.parse(storedUser));
    const storedPets = localStorage.getItem('pets');
    let loadedPets: Pet[] = [];
    if (storedPets) { loadedPets = JSON.parse(storedPets); setPets(loadedPets); }
    else { loadedPets = INITIAL_PETS; setPets(INITIAL_PETS); localStorage.setItem('pets', JSON.stringify(INITIAL_PETS)); }
    if (loadedPets.length > 0 && !newReminder.petId) { setNewReminder(prev => ({ ...prev, petId: loadedPets[0].id })); }
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) setReminders(JSON.parse(storedReminders));
    else { setReminders(MOCK_REMINDERS); localStorage.setItem('reminders', JSON.stringify(MOCK_REMINDERS)); }
    generateSmartTip(loadedPets);
  }, []);

  const generateSmartTip = (currentPets: Pet[]) => {
    if (currentPets.length === 0) {
      setSmartTip({ title: "Welcome to Pawsitivity! 🐾", text: "Add your first pet to receive personalized health and care tips tailored just for them." });
      return;
    }
    const pet = currentPets[Math.floor(Math.random() * currentPets.length)];
    const type = (pet.type === 'Dog' || pet.type === 'Cat') ? pet.type : 'Other';
    let ageGroup = 'adult';
    if (pet.age < 1) ageGroup = 'young';
    else if (pet.age >= 7) ageGroup = 'senior';
    const tipsList = TIPS[type as keyof typeof TIPS];
    let selectedTips: string[] = [];
    if (Array.isArray(tipsList)) { selectedTips = tipsList; } 
    else { selectedTips = tipsList[ageGroup as keyof typeof tipsList]; }
    const randomTip = selectedTips[Math.floor(Math.random() * selectedTips.length)];
    setSmartTip({ title: `Tip for ${pet.name} (${pet.type})`, text: randomTip });
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.petId) return;
    const reminder: Reminder = { id: Date.now().toString(), petId: newReminder.petId, title: newReminder.title, date: newReminder.date, type: newReminder.type as any, completed: false };
    const updatedReminders = [...reminders, reminder].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    setIsModalOpen(false);
    setNewReminder(prev => ({ ...prev, title: '', date: '' }));
  };

  const toggleReminder = (id: string) => {
    const updatedReminders = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };

  const today = new Date().toISOString().split('T')[0];
  const availablePetTypes = ['All', ...Array.from(new Set(pets.map(p => p.type)))];

  const matchesFilter = (reminder: Reminder) => {
    if (reminderFilterType === 'All') return true;
    const pet = pets.find(p => p.id === reminder.petId);
    return pet?.type === reminderFilterType;
  };

  const todaysReminders = reminders.filter(r => r.date === today && !r.completed && matchesFilter(r));
  const overdueReminders = reminders.filter(r => r.date < today && !r.completed && matchesFilter(r));
  const upcomingReminders = reminders.filter(r => r.date > today && !r.completed && matchesFilter(r)).slice(0, 3);
  const nextVetVisit = pets.filter(p => p.nextVaccination).sort((a, b) => new Date(a.nextVaccination!).getTime() - new Date(b.nextVaccination!).getTime())[0];

  return (
    <div className="p-4 md:p-12 max-w-[1440px] mx-auto space-y-12 pb-24">
      {/* Header Greeting */}
      <div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
          Hello, {user?.name ? user.name.split(' ')[0] : 'Mira'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-xl font-bold tracking-tight">It's a beautiful day for your pack.</p>
      </div>

      {/* Stats Grid - Screenshot Match */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#136E6E] rounded-[36px] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-[180px]">
              <div className="relative z-10">
                <p className="text-teal-200/60 text-[10px] font-black uppercase tracking-widest mb-2">Today's Focus</p>
                <h3 className="text-7xl font-black flex items-center gap-4 leading-none">
                    {todaysReminders.length} 
                    <span className="text-2xl font-black italic opacity-80 mt-2">Pending</span>
                </h3>
              </div>
              {/* Decorative Inset from Mockup */}
              <div className="absolute bottom-6 right-8 bg-[#0D5C5C] w-48 h-10 rounded-xl border border-[#168585]/30"></div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-[36px] p-8 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] border border-gray-300 dark:border-gray-700 flex items-center justify-between h-[180px]">
              <div className="space-y-1">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Family</p>
                <h3 className="text-5xl font-black text-gray-900 dark:text-white">{pets.length} Pets</h3>
              </div>
              <div className="w-16 h-16 bg-[#FFF1F6] dark:bg-pink-900/20 rounded-[24px] flex items-center justify-center text-[#FF4D8D]">
                <Activity size={32} />
              </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-[36px] p-8 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] border border-gray-300 dark:border-gray-700 flex items-center justify-between h-[180px]">
              <div className="space-y-1">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Vet Visit</p>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white truncate">
                    {nextVetVisit ? new Date(nextVetVisit.nextVaccination!).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'}) : 'None'}
                </h3>
              </div>
              <div className="w-16 h-16 bg-[#EBF5FF] dark:bg-blue-900/20 rounded-[24px] flex items-center justify-center text-[#3B82F6]">
                <Clock size={32} />
              </div>
          </div>
      </div>

      {/* Tip Banner - Bubbly Style Match */}
      <div className="bg-[#E9F7F5] dark:bg-teal-900/20 border-2 border-gray-300 dark:border-teal-800/50 rounded-[56px] p-2 flex items-center shadow-sm">
          <div className="bg-[#136E6E] text-white w-24 h-24 rounded-[40px] shrink-0 flex items-center justify-center shadow-lg transform -rotate-3 ml-2">
              <Lightbulb size={40} />
          </div>
          <div className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-md rounded-[48px] px-10 py-6 ml-6 flex-1 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-black text-[#136E6E] dark:text-teal-200 text-2xl italic tracking-tighter mb-1 leading-none">{smartTip.title} 🐾</h3>
              <p className="text-[#1A4B4B] dark:text-teal-50 font-bold text-lg leading-tight tracking-tight">{smartTip.text}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-8">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">My Family</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {pets.map((pet) => (
                <div key={pet.id} onClick={() => navigate(`/pet/${pet.id}`)} className="bg-white dark:bg-gray-800 rounded-[56px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer relative">
                    <div className="h-72 relative overflow-hidden">
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-6 py-2 rounded-2xl text-[11px] font-black uppercase text-gray-800 shadow-xl border border-gray-200">{pet.age} YRS</div>
                    </div>
                    <div className="p-12">
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 italic tracking-tighter">{pet.name}</h3>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{pet.breed} • {pet.type}</p>
                        <div className="mt-10 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-10">
                             <div className="text-[11px] font-black text-[#FF4D8D] uppercase tracking-[0.2em]">Profile View</div>
                             <ChevronRight className="text-gray-400 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </div>
              ))}
              {pets.length === 0 && (
                <div className="col-span-full py-32 text-center border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-[64px] group hover:border-teal-100 transition-all flex flex-col items-center">
                    <div className="w-28 h-28 bg-gray-100 dark:bg-gray-800/50 rounded-[40px] flex items-center justify-center mb-10 text-gray-300 group-hover:scale-110 transition-transform shadow-inner">
                        <Plus size={56} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-400 italic tracking-tighter uppercase">Pack is Empty</h3>
                    <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest">Start by adding your first pet buddy</p>
                </div>
              )}
          </div>
          
          <div className="flex justify-center">
            <Link to="/add-pet" className="bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] px-14 py-5 rounded-[28px] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(15,23,42,0.2)] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3">
              <Plus size={22} /> Add Pet
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none px-2">Upcoming Care</h2>
          <div className="bg-white dark:bg-gray-800 rounded-[64px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border-2 border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
             <div className="p-10 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/30 flex justify-between items-center">
                 <span className="font-black text-gray-900 dark:text-white text-lg italic uppercase tracking-tighter">Care Log</span>
                 <button onClick={() => setIsModalOpen(true)} className="text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 px-8 py-3 rounded-2xl hover:text-[#FF4D8D] hover:border-[#FF4D8D] transition-all shadow-sm">+ Task</button>
             </div>
             
             {pets.length > 0 && (
                <div className="px-10 py-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 overflow-x-auto scrollbar-hide bg-gray-100/50">
                    <Filter size={16} className="text-gray-500 shrink-0" />
                    {availablePetTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setReminderFilterType(type)}
                            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                                ${reminderFilterType === type 
                                    ? 'bg-[#FF4D8D] text-white shadow-lg scale-105' 
                                    : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
             )}
             
             <div className="p-10 space-y-12">
                {overdueReminders.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-[11px] font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><AlertTriangle size={14} /> Overdue</h3>
                        {overdueReminders.map(r => <ReminderItem key={r.id} reminder={r} toggle={toggleReminder} petName={pets.find(p=>p.id===r.petId)?.name || 'Pet'} isOverdue />)}
                    </div>
                )}
                {todaysReminders.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-[11px] font-black text-teal-600 uppercase tracking-[0.2em] mb-4 italic">Today</h3>
                        {todaysReminders.map(r => <ReminderItem key={r.id} reminder={r} toggle={toggleReminder} petName={pets.find(p=>p.id===r.petId)?.name || 'Pet'} />)}
                    </div>
                )}
                {upcomingReminders.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 italic">Next</h3>
                        {upcomingReminders.map(r => <ReminderItem key={r.id} reminder={r} toggle={toggleReminder} petName={pets.find(p=>p.id===r.petId)?.name || 'Pet'} />)}
                    </div>
                )}
                {reminders.length === 0 && <div className="text-center py-32 opacity-10 italic"><CheckCircle2 className="mx-auto mb-8" size={80} /><p className="text-3xl font-black">ALL DONE</p></div>}
             </div>
          </div>
        </div>
      </div>

      {/* MODALS remain largely the same, but styled consistently */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="flex min-h-full items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 rounded-[64px] w-full max-w-lg p-12 md:p-16 shadow-2xl border border-gray-300 dark:border-gray-700 relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Add Task</h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-3xl hover:text-paws-rose transition-all shadow-inner"><X size={32} className="text-gray-500" /></button>
                </div>
                <form onSubmit={handleAddReminder} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-4">For Pet</label>
                        <select value={newReminder.petId} onChange={e => setNewReminder({...newReminder, petId: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-[32px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/20 cursor-pointer shadow-inner text-lg border border-gray-200 dark:border-transparent">
                            {pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-4">Task Detail</label>
                        <input required placeholder="e.g. Morning Curd & Rice" value={newReminder.title} onChange={e => setNewReminder({...newReminder, title: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-[32px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/20 shadow-inner text-lg border border-gray-200 dark:border-transparent" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-4">Date</label>
                            <input required type="date" value={newReminder.date} min={today} onChange={e => setNewReminder({...newReminder, date: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-[32px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/20 shadow-inner border border-gray-200 dark:border-transparent" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-4">Category</label>
                            <select value={newReminder.type} onChange={e => setNewReminder({...newReminder, type: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-[32px] p-6 font-bold dark:text-white focus:ring-4 focus:ring-teal-500/20 cursor-pointer shadow-inner border border-gray-200 dark:border-transparent">
                                <option value="Vaccine">Vaccine</option><option value="Grooming">Grooming</option><option value="Medication">Medication</option><option value="Food">Food</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-[#136E6E] text-white font-black py-7 rounded-[48px] shadow-2xl active:scale-95 transition-all mt-8 uppercase tracking-[0.2em] text-sm italic border-b-8 border-[#0B4444]">Save Task</button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReminderItem: React.FC<{ reminder: Reminder; toggle: (id: string) => void; petName: string; isOverdue?: boolean }> = ({ reminder, toggle, petName, isOverdue }) => (
    <div className={`flex items-center gap-8 p-8 rounded-[40px] border-2 group transition-all duration-500 ${isOverdue ? 'bg-red-50/30 border-red-200 shadow-sm' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-50 shadow-sm hover:shadow-xl'}`}>
        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white shrink-0 shadow-lg ${reminder.type === 'Vaccine' ? 'bg-red-500' : reminder.type === 'Grooming' ? 'bg-[#7C3AED]' : reminder.type === 'Medication' ? 'bg-[#3B82F6]' : 'bg-[#136E6E]'}`}><Bell size={28} /></div>
        <div className="flex-1 min-w-0">
            <h4 className={`font-black text-xl truncate italic tracking-tighter leading-none mb-1 ${reminder.completed ? 'text-gray-300 line-through' : 'text-gray-900 dark:text-white'}`}>{reminder.title}</h4>
            <p className={`text-[11px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                {new Date(reminder.date).toLocaleDateString('en-IN', {day:'numeric', month:'short'})} • <span className="text-[#136E6E]">{petName}</span>
            </p>
        </div>
        <button onClick={() => toggle(reminder.id)} className={`w-14 h-14 rounded-full border-4 transition-all flex items-center justify-center ${reminder.completed ? 'bg-teal-600 border-teal-600 text-white scale-110 shadow-lg' : 'border-gray-200 dark:border-gray-700 text-transparent hover:border-teal-500'}`}>
            <Check size={28} strokeWidth={4} />
        </button>
    </div>
);

export default Dashboard;