import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Star, Navigation, Filter, Search, Layers, Locate, ArrowRight } from 'lucide-react';
import { Service } from '../types';
import L from 'leaflet';

// Utility to generate random coordinates around a point
const getRandomOffset = (lat: number, lng: number, radiusInKm: number = 5) => {
    const r = radiusInKm / 111.32; // Rough approximation
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    const newLat = x + lat;
    const newLng = y / Math.cos(lat) + lng;
    return [newLat, newLng] as [number, number];
};

// Templates for generating dynamic local services
const SERVICE_NAMES = [
    { name: "Paws & Claws Clinic", type: "Vet" },
    { name: "Happy Tails Grooming", type: "Groomer" },
    { name: "City Pet Hospital", type: "Vet" },
    { name: "Bark Avenue Spa", type: "Groomer" },
    { name: "K9 Training Academy", type: "Training" },
    { name: "Pet Supplies Plus", type: "Store" },
    { name: "Dr. Smith's Animal Care", type: "Vet" },
    { name: "The Dog House", type: "Boarding" }
];

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const serviceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');

  // Generate mock services based on a center location
  const generateServices = (lat: number, lng: number) => {
      return SERVICE_NAMES.map((template, i) => {
          const coords = getRandomOffset(lat, lng, 3); // Within 3km
          const dist = Math.sqrt(Math.pow(coords[0] - lat, 2) + Math.pow(coords[1] - lng, 2)) * 111.32;
          return {
              id: `gen_${i}`,
              name: template.name,
              type: template.type,
              rating: (4 + Math.random()).toFixed(1),
              reviews: Math.floor(Math.random() * 100) + 10,
              location: `${dist.toFixed(1)} km away`,
              coords: coords,
              priceStart: Math.floor(Math.random() * 500) + 300,
              contact: '+91 98765 XXXXX'
          };
      });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default view (India center) before location is found
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Get User Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                
                // Fly to user
                map.flyTo([latitude, longitude], 14, { duration: 2 });

                // Add User Marker
                const userIconHtml = `
                    <div class="relative w-4 h-4">
                        <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                        <div class="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                    </div>
                `;
                const userIcon = L.divIcon({ className: 'bg-transparent', html: userIconHtml, iconSize: [16, 16], iconAnchor: [8, 8] });
                L.marker([latitude, longitude], { icon: userIcon }).addTo(map).bindPopup("You are here").openPopup();

                // Generate Services around user
                const nearbyServices = generateServices(latitude, longitude);
                setServices(nearbyServices);
            },
            (error) => {
                console.warn("Location access denied, using default mock data for Delhi");
                const delhiCoords: [number, number] = [28.6139, 77.2090];
                setUserLocation(delhiCoords);
                map.setView(delhiCoords, 13);
                setServices(generateServices(delhiCoords[0], delhiCoords[1]));
            }
        );
    }
  }, []);

  // Update Markers when services list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    services.forEach(service => {
        if (service.coords) {
            const isSelected = selectedServiceId === service.id;
            
            const iconHtml = `
                <div class="custom-marker-pin w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all ${isSelected ? 'bg-paws-pink scale-110 z-50' : 'bg-white text-paws-pink'}" style="background-color: ${isSelected ? '#FF4D8D' : '#ffffff'};">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? 'white' : '#FF4D8D'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </div>
            `;

            const customIcon = L.divIcon({
                className: 'bg-transparent',
                html: iconHtml,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            const marker = L.marker(service.coords, { icon: customIcon }).addTo(map);
            
            const popupContent = `
                <div class="p-2 min-w-[150px] font-sans">
                    <h3 class="font-bold text-gray-800 text-sm mb-1">${service.name}</h3>
                    <div class="flex items-center gap-1 mb-1">
                        <span class="text-xs bg-gray-100 px-1.5 rounded text-gray-600 font-medium">${service.type}</span>
                        <span class="text-xs text-yellow-600 font-bold">★ ${service.rating}</span>
                    </div>
                    <p class="text-xs text-gray-500">${service.location}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            marker.on('click', () => handleServiceSelect(service.id));
            markersRef.current[service.id] = marker;
        }
    });
  }, [services, selectedServiceId]);

  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
    const element = serviceRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const service = services.find(s => s.id === id);
    if (mapInstanceRef.current && service) {
        mapInstanceRef.current.flyTo(service.coords, 15, { duration: 1.5 });
        markersRef.current[id]?.openPopup();
    }
  };

  const filteredServices = services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            service.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All Types' || service.type === typeFilter;
      return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:flex-row">
      {/* Sidebar List */}
      <div className="md:w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors duration-200 relative flex flex-col">
        <div className="p-4 sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur z-10 border-b border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 italic tracking-tight">
                 Services Nearby <span className="text-2xl not-italic">🏥</span>
              </h2>
              {userLocation && (
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <Locate size={10} /> GPS Active
                  </span>
              )}
          </div>
          <div className="space-y-3">
            <div className="relative group">
                <Search className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-paws-pink transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search Vets, Groomers..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-paws-pink focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 border-none font-medium"
                />
            </div>
            <div className="relative">
                 <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none border-none font-bold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                 >
                    <option>All Types</option>
                    <option>Vet</option>
                    <option>Groomer</option>
                    <option>Training</option>
                    <option>Store</option>
                 </select>
                 <Filter size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1">
          {filteredServices.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                  <MapPin size={48} className="mx-auto mb-2 opacity-20" />
                  <p className="font-bold text-sm">Searching area...</p>
                  <p className="text-xs mt-1">Ensure location is enabled.</p>
              </div>
          ) : (
            filteredServices.map(service => (
                <div 
                    key={service.id} 
                    ref={el => { serviceRefs.current[service.id] = el }}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`border rounded-[20px] p-5 cursor-pointer transition-all duration-300 relative overflow-hidden group
                        ${selectedServiceId === service.id 
                            ? 'border-paws-pink bg-pink-50/50 dark:bg-pink-900/10 ring-1 ring-paws-pink shadow-md transform scale-[1.02]' 
                            : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-paws-pink/30 hover:shadow-lg'
                        }
                    `}
                >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-black text-gray-800 dark:text-white text-lg leading-tight group-hover:text-paws-pink transition-colors">{service.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{service.type}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs px-2 py-1 rounded-lg font-black flex items-center gap-1">
                            {service.rating} <Star size={10} fill="currentColor" />
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium mt-1">({service.reviews} reviews)</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg w-fit">
                    <Navigation size={14} className="text-blue-500 shrink-0" />
                    <span className="font-bold">{service.location}</span>
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3 mt-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">From <span className="text-gray-900 dark:text-white text-sm">₹{service.priceStart}</span></span>
                    <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl text-xs font-black hover:scale-105 transition-transform flex items-center gap-1">
                        Book <ArrowRight size={12} />
                    </button>
                </div>
                </div>
            ))
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="md:w-2/3 bg-gray-100 dark:bg-gray-900 relative h-64 md:h-auto order-first md:order-last">
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />
        
        <div className="absolute bottom-8 right-8 z-[400] flex flex-col gap-3">
            <button 
                onClick={() => {
                   if (mapInstanceRef.current && userLocation) {
                        mapInstanceRef.current.flyTo(userLocation, 15);
                   } else {
                       alert("Locating you...");
                   }
                }}
                className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-xl text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform hover:scale-110 border border-gray-100 dark:border-gray-600"
                title="Recenter"
            >
                <Locate size={24} className="text-paws-pink" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Services;