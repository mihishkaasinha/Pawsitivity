import React, { useState } from 'react';
import { Sparkles, Heart, X, Zap, MapPin, Info, ArrowRight, CheckCircle2 } from 'lucide-react';

const MOCK_PETS = [
  { id: 'p1', name: 'Zorro', breed: 'Husky', age: 2, energy: 'High', style: 'Rough/Runner', image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80', compatibility: 92 },
  { id: 'p2', name: 'Luna', breed: 'Golden Retriever', age: 4, energy: 'Moderate', style: 'Gentle', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', compatibility: 85 },
  { id: 'p3', name: 'Coco', breed: 'Indie', age: 1, energy: 'High', style: 'Chaser', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80', compatibility: 78 }
];

const Playdates: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
      if (direction === 'right') {
          // Randomly trigger a match for demo
          if (Math.random() > 0.5) {
              setIsMatch(true);
              return;
          }
      }
      if (currentIndex < MOCK_PETS.length - 1) {
          setCurrentIndex(currentIndex + 1);
      } else {
          setCurrentIndex(0); // Loop for demo
      }
  };

  const pet = MOCK_PETS[currentIndex];

  if (isMatch) {
      return (
          <div className="fixed inset-0 z-[200] bg-teal-600 flex flex-center flex-col items-center justify-center p-8 text-white animate-fade-in">
              <div className="relative mb-8">
                  <Heart size={120} className="text-white fill-white animate-bounce" />
                  <Sparkles size={40} className="absolute top-0 right-0 text-yellow-300" />
              </div>
              <h1 className="text-5xl font-black mb-4">It's a Match! 🎉</h1>
              <p className="text-xl text-teal-100 mb-12 text-center max-w-md">You and {pet.name}'s parent liked each other! Time for a playdate?</p>
              
              <div className="flex gap-4 w-full max-w-sm">
                  <button onClick={() => setIsMatch(false)} className="flex-1 bg-white text-teal-600 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">Say Hello</button>
                  <button onClick={() => {setIsMatch(false); handleSwipe('right')}} className="flex-1 border-2 border-white/30 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">Keep Browsing</button>
              </div>
          </div>
      )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-20 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
            Smart Playdate Pairing <Zap className="text-yellow-400 fill-yellow-400" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Our AI finds the best matches for your pet's energy and style.</p>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
          {/* Card Stack */}
          <div className="relative w-full aspect-[3/4] max-h-[600px] bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                  <div className="flex justify-between items-end mb-4">
                      <div>
                          <h2 className="text-4xl font-black text-white mb-1">{pet.name}, {pet.age}</h2>
                          <p className="text-white/80 font-bold flex items-center gap-1"><MapPin size={16} /> 1.2 km away • {pet.breed}</p>
                      </div>
                      <div className="bg-teal-500 text-white p-4 rounded-2xl text-center shadow-lg border border-teal-400">
                          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Match</div>
                          <div className="text-2xl font-black">{pet.compatibility}%</div>
                      </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                      <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold">{pet.energy} Energy</span>
                      <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-xs font-bold">{pet.style} Style</span>
                      <span className="bg-green-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Vaccinated</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Swipe Actions */}
      <div className="flex justify-center gap-6 mt-8">
          <button onClick={() => handleSwipe('left')} className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center text-red-500 border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 transition-all">
              <X size={32} strokeWidth={3} />
          </button>
          <button className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-blue-500 border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 transition-all">
              <Info size={24} strokeWidth={3} />
          </button>
          <button onClick={() => handleSwipe('right')} className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center text-teal-500 border border-gray-100 dark:border-gray-700 hover:scale-110 active:scale-95 transition-all">
              <Heart size={32} strokeWidth={3} fill="currentColor" />
          </button>
      </div>
    </div>
  );
};

export default Playdates;