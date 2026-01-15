import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Search, Tag, Sparkles, Filter, ChevronRight, Heart, X, Image as ImageIcon } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { PetEvent } from '../types';

const Events: React.FC = () => {
  const [events, setEvents] = useState<PetEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<PetEvent>>({
    title: '',
    description: '',
    type: 'Meetup',
    date: '',
    time: '',
    location: '',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80'
  });

  useEffect(() => {
    const saved = localStorage.getItem('pawsEvents');
    if (saved) {
        setEvents(JSON.parse(saved));
    } else {
        setEvents(MOCK_EVENTS);
        localStorage.setItem('pawsEvents', JSON.stringify(MOCK_EVENTS));
    }
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.location) return;

    const event: PetEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description || 'Join our local pet community gathering!',
        type: newEvent.type || 'Meetup',
        date: newEvent.date,
        time: newEvent.time || '4:00 PM',
        location: newEvent.location,
        image: newEvent.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
        organizer: 'Me',
        attendees: 1
    };

    const updated = [event, ...events];
    setEvents(updated);
    localStorage.setItem('pawsEvents', JSON.stringify(updated));
    setIsModalOpen(false);
    setNewEvent({ 
      title: '', description: '', type: 'Meetup', date: '', time: '', location: '', 
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            Meetups & Workshops <Sparkles className="text-yellow-400" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Join breed gatherings, training sessions, and weekend workshops near you.</p>
        </div>
        
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-paws-pink text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-paws-pink/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm"
        >
            <Plus size={20} /> Host Your Own
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map(event => (
                      <div key={event.id} className="bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group animate-fade-in-down">
                          <div className="h-52 relative overflow-hidden">
                              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm text-gray-700 dark:text-white">
                                  {event.type}
                              </div>
                              <div className="absolute bottom-4 right-4 bg-paws-pink text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                  {event.attendees} Attending
                              </div>
                          </div>
                          <div className="p-7">
                              <div className="flex items-center gap-2 text-paws-pink font-black text-xs mb-3">
                                  <Calendar size={16} /> {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.time}
                              </div>
                              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-paws-pink transition-colors">{event.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-1 font-medium"><MapPin size={14} className="text-red-400" /> {event.location}</p>
                              
                              <div className="flex justify-between items-center pt-5 border-t border-gray-50 dark:border-gray-700">
                                  <div className="flex -space-x-3">
                                      {[1,2,3].map(i => <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700"></div>)}
                                      <div className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 bg-teal-50 dark:bg-teal-900 text-teal-600 flex items-center justify-center text-[10px] font-black shadow-inner">+{event.attendees > 3 ? event.attendees - 3 : '8'}</div>
                                  </div>
                                  <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-black text-xs hover:opacity-90 active:scale-95 transition-all">
                                      Join Now
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                  <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-8">Active Pet Clubs</h3>
                  <div className="space-y-8">
                      {[
                        { name: 'Cubbon Park Indies', loc: 'Bangalore', img: '🌳' },
                        { name: 'Mumbai Persian Pals', loc: 'Mumbai', img: '🐈' },
                        { name: 'Delhi Lab Squad', loc: 'Delhi NCR', img: '🦴' }
                      ].map((club, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-2xl font-bold shadow-inner group-hover:scale-110 transition-transform">{club.img}</div>
                            <div className="min-w-0">
                                <p className="text-sm font-black dark:text-white leading-tight mb-1 truncate">{club.name}</p>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{club.loc}</p>
                            </div>
                        </div>
                      ))}
                      <button className="w-full py-4 border-2 border-paws-pink/20 text-paws-pink rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-paws-pink hover:text-white transition-all shadow-sm">Explore More Clubs</button>
                  </div>
              </div>
          </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-[40px] w-full max-w-lg p-10 shadow-2xl border border-gray-100 dark:border-gray-700 relative scale-100">
                  <div className="flex justify-between items-center mb-10">
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white italic">Plan a Meetup</h2>
                      <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-all"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleCreate} className="space-y-5">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">General Info</label>
                        <input required placeholder="Event Name (e.g. Beagle Brunch)" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 font-bold border-none focus:ring-2 focus:ring-paws-pink dark:text-white mb-3" />
                        <textarea placeholder="Describe the vibe... (optional)" rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 font-bold border-none focus:ring-2 focus:ring-paws-pink dark:text-white resize-none" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Date</label>
                            <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 font-bold border-none dark:text-white" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Time</label>
                            <input required type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 font-bold border-none dark:text-white" />
                          </div>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Location</label>
                        <input required placeholder="Venue Name (e.g. Cubbon Park Gate 2)" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 font-bold border-none focus:ring-2 focus:ring-paws-pink dark:text-white" />
                      </div>

                      <button type="submit" className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-6 uppercase tracking-widest text-sm">Broadcast to Neighbors</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Events;