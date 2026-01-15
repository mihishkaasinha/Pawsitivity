import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Users, Sparkles, Filter, List, Heart, MessageCircle, UserPlus, Zap, Star, Check, ArrowRight } from 'lucide-react';
import L from 'leaflet';

// Expanded Mock Data
const ALL_NEIGHBORS = [
  { id: 'n1', name: 'Rohan Iyer', pet: 'Sheru', breed: 'Indie', age: 3, distance: 0.5, distanceStr: '0.5 km', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80', status: 'Looking for play buddies', type: 'Dog', coords: [28.5355, 77.3910], color: 'indigo' },
  { id: 'n2', name: 'Simran K', pet: 'Mimi', breed: 'Persian', age: 1, distance: 1.2, distanceStr: '1.2 km', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', status: 'New to neighborhood', type: 'Cat', coords: [28.5400, 77.4000], color: 'pink' },
  { id: 'n3', name: 'Anita Roy', pet: 'Buster', breed: 'Beagle', age: 4, distance: 2.5, distanceStr: '2.5 km', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80', status: 'Training partner wanted', type: 'Dog', coords: [28.5300, 77.3800], color: 'sky' },
  { id: 'n4', name: 'Vikram Singh', pet: 'Rocky', breed: 'German Shepherd', age: 2, distance: 5.0, distanceStr: '5.0 km', image: 'https://images.unsplash.com/photo-1589944191401-efb6713a2a6d?auto=format&fit=crop&w=400&q=80', status: 'Loves long runs', type: 'Dog', coords: [28.5500, 77.3700], color: 'orange' },
  { id: 'n5', name: 'Priya D', pet: 'Luna', breed: 'Siamese', age: 2, distance: 0.8, distanceStr: '0.8 km', image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=400&q=80', status: 'Indoor playdates', type: 'Cat', coords: [28.5450, 77.3950], color: 'purple' },
  { id: 'n6', name: 'Amit Kumar', pet: 'Max', breed: 'Labrador', age: 5, distance: 8.5, distanceStr: '8.5 km', image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&w=400&q=80', status: 'Chill walking buddy', type: 'Dog', coords: [28.5200, 77.4100], color: 'teal' },
  { id: 'n7', name: 'Sonal M', pet: 'Coco', breed: 'Pug', age: 1, distance: 12.0, distanceStr: '12 km', image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=400&q=80', status: 'Social butterfly', type: 'Dog', coords: [28.5100, 77.4200], color: 'pink' },
  { id: 'n8', name: 'Rahul V', pet: 'Oreo', breed: 'Rabbit', age: 1, distance: 3.0, distanceStr: '3.0 km', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80', status: 'Hopping around', type: 'Other', coords: [28.5380, 77.3850], color: 'green' },
  { id: 'n9', name: 'Deepak S', pet: 'Charlie', breed: 'Golden Retriever', age: 3, distance: 4.2, distanceStr: '4.2 km', image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e27?auto=format&fit=crop&w=400&q=80', status: 'Always ready to fetch', type: 'Dog', coords: [28.5250, 77.4050], color: 'orange' },
  { id: 'n10', name: 'Kavita M', pet: 'Whiskers', breed: 'Tabby', age: 4, distance: 1.5, distanceStr: '1.5 km', image: 'https://images.unsplash.com/photo-1573865668131-974f71230a49?auto=format&fit=crop&w=400&q=80', status: 'Needs catnip friends', type: 'Cat', coords: [28.5420, 77.3980], color: 'purple' },
  { id: 'n11', name: 'Arjun R', pet: 'Leo', breed: 'Rottweiler', age: 2, distance: 6.0, distanceStr: '6.0 km', image: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?auto=format&fit=crop&w=400&q=80', status: 'Gentle giant', type: 'Dog', coords: [28.5150, 77.4150], color: 'indigo' },
  { id: 'n12', name: 'Sneha P', pet: 'Tweety', breed: 'Canary', age: 1, distance: 2.0, distanceStr: '2.0 km', image: 'https://images.unsplash.com/photo-1552728089-57bdde30eba3?auto=format&fit=crop&w=400&q=80', status: 'Morning singer', type: 'Other', coords: [28.5320, 77.3880], color: 'green' }
];

const DiscoveryCard: React.FC<{ n: any }> = ({ n }) => {
    const [status, setStatus] = useState<'Connect' | 'Pending' | 'Connected'>('Connect');

    const handleConnect = () => {
        setStatus('Pending');
        setTimeout(() => setStatus('Connected'), 1500);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full transform hover:-translate-y-2 duration-300">
            <div className="h-64 relative overflow-hidden shrink-0">
                <img src={n.image} alt={n.pet} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-800 shadow-xl border border-white/50 z-10">
                    {n.distanceStr} away
                </div>
                <div className={`absolute bottom-4 left-4 ${n.type === 'Dog' ? 'bg-indigo-600' : n.type === 'Cat' ? 'bg-rose-500' : 'bg-teal-500'} text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 z-10`}>
                    {n.type} 🐾
                </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">{n.pet} <span className="text-xs text-gray-400 font-bold not-italic ml-1">• {n.breed}</span></h3>
                    <div className="flex items-center gap-1 text-yellow-500 font-black text-xs">
                        <Star size={14} fill="currentColor" /> 5.0
                    </div>
                </div>
                
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-6">{n.age} Yrs • Parent: {n.name}</p>

                <div className={`flex items-center gap-3 p-4 rounded-3xl mb-8 border-2 ${
                    n.color === 'indigo' ? 'bg-indigo-50/80 border-indigo-100 text-indigo-800' : 
                    n.color === 'pink' ? 'bg-rose-50/80 border-rose-100 text-rose-800' : 
                    n.color === 'orange' ? 'bg-orange-50/80 border-orange-100 text-orange-800' :
                    'bg-sky-50/80 border-sky-100 text-sky-800'
                }`}>
                    <Zap size={18} className="animate-pulse shrink-0" />
                    <p className="text-xs font-black italic">"{n.status}"</p>
                </div>

                <div className="flex gap-3 mt-auto">
                    <button 
                      onClick={handleConnect}
                      disabled={status !== 'Connect'}
                      className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 border-2 
                        ${status === 'Connected' 
                            ? 'bg-green-500 text-white border-green-500' 
                            : status === 'Pending' 
                                ? 'bg-gray-100 text-gray-500 border-gray-200' 
                                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent hover:scale-[1.02] active:scale-95'
                        }`}
                    >
                        {status === 'Connected' ? <><Check size={16} /> Sent</> : status === 'Pending' ? 'Sending...' : <><UserPlus size={16} /> Connect</>}
                    </button>
                    <button 
                      onClick={() => alert("Redirecting to messages...")}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 transition-all group/msg border border-gray-100 dark:border-gray-600 shadow-sm"
                    >
                        <MessageCircle size={20} className="text-gray-400 group-hover/msg:text-indigo-600 group-hover/msg:scale-110 transition-all" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Discovery: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [petTypeFilter, setPetTypeFilter] = useState('All');
  const [radiusFilter, setRadiusFilter] = useState(15);
  const [filteredNeighbors, setFilteredNeighbors] = useState(ALL_NEIGHBORS);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Filtering Logic
  useEffect(() => {
    const results = ALL_NEIGHBORS.filter(n => {
        const matchesSearch = n.pet.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              n.breed.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              n.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = petTypeFilter === 'All' || 
                            (petTypeFilter === 'Dogs Only' && n.type === 'Dog') ||
                            (petTypeFilter === 'Cats Only' && n.type === 'Cat') ||
                            (petTypeFilter === 'Others' && n.type === 'Other');

        const matchesRadius = n.distance <= radiusFilter;

        return matchesSearch && matchesType && matchesRadius;
    });
    setFilteredNeighbors(results);
  }, [searchQuery, petTypeFilter, radiusFilter]);

  // Map Initialization & Updates
  useEffect(() => {
    if (viewMode === 'map' && mapRef.current) {
        if (!mapInstance.current) {
            const map = L.map(mapRef.current).setView([28.5355, 77.3910], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            mapInstance.current = map;
        }

        // Clear existing markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // Add filtered markers
        filteredNeighbors.forEach(n => {
            const icon = L.divIcon({
                className: 'custom-pin',
                html: `<div class="w-12 h-12 rounded-2xl border-4 border-white shadow-2xl overflow-hidden ${n.type === 'Dog' ? 'bg-indigo-500' : 'bg-rose-500'} flex items-center justify-center transform transition-transform hover:scale-110"><img src="${n.image}" class="w-full h-full object-cover"></div>`,
                iconSize: [48, 48],
                iconAnchor: [24, 48],
                popupAnchor: [0, -48]
            });
            const marker = L.marker(n.coords as [number, number], { icon })
                .addTo(mapInstance.current!)
                .bindPopup(`<div class="p-2 font-bold text-center"><div>${n.pet}</div><div class="text-xs text-gray-500">${n.breed}</div></div>`);
            markersRef.current.push(marker);
        });
    }
  }, [viewMode, filteredNeighbors]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-rose-500 rounded-[40px] p-8 md:p-16 text-white mb-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/30">
                  <Sparkles size={14} className="text-yellow-300" /> Neighborhood Hub
              </div>
              <h1 className="text-4xl md:text-7xl font-black mb-4 italic tracking-tighter leading-[1.1]">Social <br/>Discovery.</h1>
              <p className="text-lg md:text-2xl font-bold opacity-90 leading-snug">Find play buddies and trusted neighbors in your community.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-10">
             <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
                <button onClick={() => setViewMode('list')} className={`px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-lg scale-105' : 'text-white/70 hover:text-white'}`}>List</button>
                <button onClick={() => setViewMode('map')} className={`px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-lg scale-105' : 'text-white/70 hover:text-white'}`}>Map</button>
             </div>
          </div>
          <Users size={300} className="absolute -right-20 -bottom-20 text-white opacity-5 transform -rotate-12 pointer-events-none" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-80 space-y-8 shrink-0">
           <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
               <div className="flex justify-between items-center mb-8">
                   <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 flex items-center gap-2 italic">
                      <Filter size={18} className="text-indigo-500" /> Filters
                   </h3>
                   <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">{filteredNeighbors.length} Results</span>
               </div>
               
               <div className="space-y-8">
                   <div className="relative group">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF4D8D] transition-colors" size={20} />
                       <input 
                         placeholder="Name, Breed..." 
                         value={searchQuery}
                         onChange={e => setSearchQuery(e.target.value)}
                         className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-black dark:text-white focus:ring-4 focus:ring-rose-500/20 transition-all outline-none shadow-inner"
                       />
                   </div>

                   <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pet Type</label>
                       <select 
                         value={petTypeFilter}
                         onChange={e => setPetTypeFilter(e.target.value)}
                         className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-4 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                       >
                           <option value="All">All Buddies 🐾</option>
                           <option value="Dogs Only">Dogs Only 🐕</option>
                           <option value="Cats Only">Cats Only 🐈</option>
                           <option value="Others">Others 🐰</option>
                       </select>
                   </div>

                   <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Radius</label>
                          <span className="text-xs font-black text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg">{radiusFilter} km</span>
                       </div>
                       <input 
                         type="range" 
                         min="1" 
                         max="20" 
                         step="1"
                         value={radiusFilter}
                         onChange={e => setRadiusFilter(Number(e.target.value))}
                         className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF4D8D]" 
                       />
                       <div className="flex justify-between text-[9px] font-bold text-gray-300 uppercase">
                           <span>1 km</span>
                           <span>20 km</span>
                       </div>
                   </div>
               </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
            {viewMode === 'list' ? (
                filteredNeighbors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
                        {filteredNeighbors.map(n => <DiscoveryCard key={n.id} n={n} />)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
                        <Users size={64} className="text-gray-300" />
                        <p className="text-xl font-black text-gray-400">No neighbors found nearby</p>
                        <button onClick={() => {setSearchQuery(''); setRadiusFilter(20); setPetTypeFilter('All');}} className="text-indigo-500 font-bold underline text-sm">Clear Filters</button>
                    </div>
                )
            ) : (
                <div className="h-[70vh] min-h-[500px] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 relative z-0 animate-fade-in">
                    <div ref={mapRef} className="h-full w-full" />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-gray-100 font-black text-xs uppercase tracking-widest text-indigo-600 flex items-center gap-2 z-[400]">
                       <MapPin size={16} /> Exploring {filteredNeighbors.length} Buddies
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;