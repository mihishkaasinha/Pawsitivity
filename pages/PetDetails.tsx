import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Calendar, Weight, Activity, Syringe, Clock, Check } from 'lucide-react';
import { Pet, Reminder } from '../types';

const PetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (!id) return;

    // Load Pet
    const storedPets = localStorage.getItem('pets');
    if (storedPets) {
      const pets: Pet[] = JSON.parse(storedPets);
      const foundPet = pets.find(p => p.id === id);
      if (foundPet) {
        setPet(foundPet);
      } else {
        navigate('/dashboard', { replace: true }); // Pet not found
      }
    }

    // Load Reminders for this pet
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
      const allReminders: Reminder[] = JSON.parse(storedReminders);
      const petReminders = allReminders
        .filter(r => r.petId === id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setReminders(petReminders);
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this pet profile? This cannot be undone.")) {
      const storedPets = localStorage.getItem('pets');
      const storedReminders = localStorage.getItem('reminders');
      
      if (storedPets && id) {
        const pets: Pet[] = JSON.parse(storedPets);
        const newPets = pets.filter(p => p.id !== id);
        localStorage.setItem('pets', JSON.stringify(newPets));
      }

      if (storedReminders && id) {
        const allReminders: Reminder[] = JSON.parse(storedReminders);
        const newReminders = allReminders.filter(r => r.petId !== id);
        localStorage.setItem('reminders', JSON.stringify(newReminders));
      }

      navigate('/dashboard', { replace: true });
    }
  };

  const toggleReminder = (reminderId: string) => {
    const updatedReminders = reminders.map(r => 
        r.id === reminderId ? { ...r, completed: !r.completed } : r
    );
    setReminders(updatedReminders);

    // Update global storage
    const storedAllReminders = localStorage.getItem('reminders');
    if (storedAllReminders) {
        const allReminders: Reminder[] = JSON.parse(storedAllReminders);
        const newGlobalReminders = allReminders.map(r => 
            r.id === reminderId ? { ...r, completed: !r.completed } : r
        );
        localStorage.setItem('reminders', JSON.stringify(newGlobalReminders));
    }
  };

  if (!pet) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-paws-pink mb-6 transition-colors font-medium">
        <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
      </button>

      {/* Hero Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-8">
        <div className="relative h-64 md:h-80">
          <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center gap-3 mb-2">
                <span className="bg-paws-pink px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {pet.type}
                </span>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white/30">
                    {pet.breed}
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{pet.name}</h1>
          </div>
          
          <div className="absolute top-6 right-6 flex gap-3">
             <Link 
                to={`/edit-pet/${pet.id}`}
                className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-full backdrop-blur-sm shadow-lg transition-all hover:scale-105"
                title="Edit Profile"
             >
                <Edit3 size={20} />
             </Link>
             <button 
                onClick={handleDelete}
                className="bg-red-500/90 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-sm shadow-lg transition-all hover:scale-105"
                title="Delete Profile"
             >
                <Trash2 size={20} />
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-100 dark:border-gray-700">
           <div className="p-6 text-center group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Calendar className="mx-auto mb-2 text-paws-blue group-hover:scale-110 transition-transform" size={24} />
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Age</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{pet.age} Years</div>
           </div>
           <div className="p-6 text-center group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Weight className="mx-auto mb-2 text-paws-green group-hover:scale-110 transition-transform" size={24} />
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Weight</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{pet.weight} kg</div>
           </div>
           <div className="p-6 text-center group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Activity className="mx-auto mb-2 text-paws-purple group-hover:scale-110 transition-transform" size={24} />
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Status</div>
              <div className="text-xl font-bold text-green-500">Healthy</div>
           </div>
           <div className="p-6 text-center group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Syringe className="mx-auto mb-2 text-red-400 group-hover:scale-110 transition-transform" size={24} />
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Next Vax</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white truncate px-2">{pet.nextVaccination || 'N/A'}</div>
           </div>
        </div>

        {/* Info Content */}
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900/50">
             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-gray-400" /> Care Timeline
             </h2>
             
             <div className="space-y-3">
                {reminders.length === 0 ? (
                    <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500">No active reminders for {pet.name}.</p>
                    </div>
                ) : (
                    reminders.map(reminder => (
                        <div key={reminder.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm
                                ${reminder.type === 'Vaccine' ? 'bg-red-400' : 
                                reminder.type === 'Grooming' ? 'bg-paws-purple' : 
                                reminder.type === 'Medication' ? 'bg-blue-400' : 'bg-paws-green'}
                            `}>
                                <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-base ${reminder.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-white'}`}>
                                    {reminder.title}
                                </h4>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(reminder.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleReminder(reminder.id)}
                                className={`p-2 rounded-full border-2 transition-all
                                    ${reminder.completed 
                                        ? 'bg-green-500 border-green-500 text-white' 
                                        : 'border-gray-300 dark:border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-500'}
                                `}
                            >
                                <Check size={20} />
                            </button>
                        </div>
                    ))
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;