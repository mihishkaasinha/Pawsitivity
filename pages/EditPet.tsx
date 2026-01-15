import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Dog, Cat, Bird, Fish, Rabbit, Rat, Turtle, PawPrint, Camera, X, Trash2, AlertTriangle } from 'lucide-react';
import { Pet } from '../types';

const EditPet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    weight: '',
    image: '',
    nextVaccination: ''
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load Pet Data
  useEffect(() => {
    if (!id) return;
    const storedPets = localStorage.getItem('pets');
    if (storedPets) {
        const pets: Pet[] = JSON.parse(storedPets);
        const pet = pets.find(p => p.id === id);
        if (pet) {
            setFormData({
                name: pet.name,
                type: pet.type,
                breed: pet.breed,
                age: pet.age.toString(),
                weight: pet.weight.toString(),
                image: pet.image,
                nextVaccination: pet.nextVaccination || ''
            });
            setPreview(pet.image);
        } else {
            navigate('/dashboard', { replace: true });
        }
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = () => setIsCameraOpen(true);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
             canvas.width = video.videoWidth;
             canvas.height = video.videoHeight;
             const ctx = canvas.getContext('2d');
             if (ctx) {
                 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                 const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                 setPreview(dataUrl);
                 setFormData(prev => ({ ...prev, image: dataUrl }));
                 setIsCameraOpen(false);
             }
        }
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    const initCamera = async () => {
        if (isCameraOpen) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Camera Error:", err);
                alert("Unable to access camera.");
                setIsCameraOpen(false);
            }
        }
    };
    initCamera();
    return () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isCameraOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const storedPets = localStorage.getItem('pets');
    const pets: Pet[] = storedPets ? JSON.parse(storedPets) : [];

    const updatedPets = pets.map(p => {
        if (p.id === id) {
            return {
                ...p,
                name: formData.name,
                type: formData.type,
                breed: formData.breed,
                age: Number(formData.age),
                weight: Number(formData.weight),
                image: formData.image || p.image,
                nextVaccination: formData.nextVaccination
            };
        }
        return p;
    });

    localStorage.setItem('pets', JSON.stringify(updatedPets));
    navigate(`/pet/${id}`);
  };

  const handleDelete = () => {
    try {
        if (!id) return;
        
        // 1. Get current data
        const storedPets = localStorage.getItem('pets');
        const storedReminders = localStorage.getItem('reminders');
        
        // 2. Filter pets
        if (storedPets) {
            const pets: Pet[] = JSON.parse(storedPets);
            const newPets = pets.filter(p => p.id !== id);
            localStorage.setItem('pets', JSON.stringify(newPets));
        }

        // 3. Filter reminders
        if (storedReminders) {
            const allReminders: any[] = JSON.parse(storedReminders);
            const newReminders = allReminders.filter(r => r.petId !== id);
            localStorage.setItem('reminders', JSON.stringify(newReminders));
        }

        // 4. Force navigation back to dashboard replacing current history
        navigate('/dashboard', { replace: true });
    } catch (error) {
        console.error("Error deleting pet:", error);
        alert("Failed to delete pet. Please try again.");
    }
  };

  const petTypes = [
    { id: 'Dog', label: 'Dog', icon: <Dog size={24} /> },
    { id: 'Cat', label: 'Cat', icon: <Cat size={24} /> },
    { id: 'Fish', label: 'Fish', icon: <Fish size={24} /> },
    { id: 'Bird', label: 'Birds', icon: <Bird size={24} /> },
    { id: 'Rabbit', label: 'Rabbits', icon: <Rabbit size={24} /> },
    { id: 'Hamster', label: 'Hamsters', icon: <Rat size={24} /> },
    { id: 'Turtle', label: 'Turtles', icon: <Turtle size={24} /> },
    { id: 'Other', label: 'Other', icon: <PawPrint size={24} /> }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-paws-pink mb-6 transition-colors font-medium">
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div className="bg-gradient-to-r from-paws-blue to-teal-400 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Edit {formData.name || 'Pet'} ✏️</h1>
          <p className="opacity-90">Update your pet's details.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-4">
             <div className="relative w-32 h-32">
                <div className={`w-full h-full rounded-full border-4 border-white dark:border-gray-600 shadow-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700`}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-gray-300 dark:text-gray-500" size={40} />
                  )}
                </div>
             </div>
             
             <div className="flex gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                    <Upload size={16} /> Gallery
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                <button type="button" onClick={startCamera} className="flex items-center gap-2 px-4 py-2 bg-paws-pink text-white rounded-full text-sm font-bold hover:bg-teal-600 transition-colors shadow-md">
                    <Camera size={16} /> Camera
                </button>
             </div>
          </div>

          <div className="space-y-6">
             {/* Type Selection */}
             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Pet Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {petTypes.map(item => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setFormData({ ...formData, type: item.id })}
                    className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 font-bold transition-all gap-2
                      ${formData.type === item.id
                        ? 'border-paws-pink bg-teal-50 dark:bg-teal-900/30 text-paws-pink dark:text-teal-400 shadow-md transform scale-[1.02]' 
                        : 'border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-paws-pink/50 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Breed</label>
              <input required name="breed" value={formData.breed} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Age (Years)</label>
                <input required type="number" min="0" step="0.1" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all text-gray-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Weight (kg)</label>
                <input required type="number" min="0" step="0.1" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all text-gray-900 dark:text-white" />
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Next Vaccination Date</label>
                <input 
                    type="date"
                    name="nextVaccination"
                    value={formData.nextVaccination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all text-gray-900 dark:text-white"
                />
            </div>
          </div>

          <div className="pt-4 space-y-3">
             <button type="submit" className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-xl">
              <Save size={20} />
              Update Profile
            </button>

            <button 
                type="button" 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              Delete Pet
            </button>
          </div>
        </form>
      </div>

      {isCameraOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-around items-center bg-gradient-to-t from-black/80 to-transparent">
                      <button type="button" onClick={() => setIsCameraOpen(false)} className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all"><X size={24} /></button>
                      <button type="button" onClick={capturePhoto} className="p-1 rounded-full border-4 border-white/50 hover:border-white transition-all hover:scale-105"><div className="w-16 h-16 bg-white rounded-full" /></button>
                      <div className="w-12" />
                  </div>
              </div>
              <p className="text-white/70 mt-4 text-sm font-medium">Position your pet in the frame</p>
          </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Profile?</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    Are you sure you want to remove {formData.name}? This action cannot be undone and all reminders will be deleted.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default EditPet;