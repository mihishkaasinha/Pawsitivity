import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, Dog, Cat, Bird, Fish, Rabbit, Rat, Turtle, PawPrint, Camera, X } from 'lucide-react';
import { Pet } from '../types';

const AddPet: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    weight: '',
    image: ''
  });
  const [preview, setPreview] = useState<string | null>(null);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Camera Functions
  const startCamera = () => {
    setIsCameraOpen(true);
  };

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

  // Initialize camera stream when modal opens
  useEffect(() => {
    let stream: MediaStream | null = null;

    const initCamera = async () => {
        if (isCameraOpen) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera Error:", err);
                alert("Unable to access camera. Please check your device permissions.");
                setIsCameraOpen(false);
            }
        }
    };

    initCamera();

    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [isCameraOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPets = localStorage.getItem('pets');
    const pets: Pet[] = storedPets ? JSON.parse(storedPets) : [];

    const finalImage = formData.image || `https://picsum.photos/seed/${formData.name}/200/200`;

    const newPet: Pet = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      age: Number(formData.age),
      weight: Number(formData.weight),
      image: finalImage,
      nextVaccination: ''
    };

    const updatedPets = [...pets, newPet];
    localStorage.setItem('pets', JSON.stringify(updatedPets));
    navigate('/dashboard');
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
        <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div className="bg-gradient-to-r from-paws-pink to-paws-orange p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Add New Family Member 🐾</h1>
          <p className="opacity-90">Fill in the details to create a profile for your pet.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-4">
             <div className="relative w-32 h-32">
                <div className={`w-full h-full rounded-full border-4 border-white dark:border-gray-600 shadow-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700 ${!preview ? 'border-dashed border-gray-300 dark:border-gray-500' : ''}`}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-gray-300 dark:text-gray-500" size={40} />
                  )}
                </div>
             </div>
             
             <div className="flex gap-4">
                {/* Upload Button */}
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                    <Upload size={16} />
                    Gallery
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden" 
                    />
                </label>

                {/* Camera Button */}
                <button 
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-paws-pink text-white rounded-full text-sm font-bold hover:bg-teal-600 transition-colors shadow-md"
                >
                    <Camera size={16} />
                    Camera
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
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                placeholder="Pet's Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Breed</label>
              <input 
                required
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                placeholder="e.g. Golden Retriever, Persian..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Age (Years)</label>
                <input 
                  required
                  type="number"
                  min="0"
                  step="0.1"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Weight (kg)</label>
                <input 
                  required
                  type="number"
                  min="0"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-paws-pink focus:outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
             <button 
              type="submit" 
              className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-xl"
            >
              <Save size={20} />
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Camera Overlay Modal */}
      {isCameraOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Camera Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-around items-center bg-gradient-to-t from-black/80 to-transparent">
                      <button 
                        type="button"
                        onClick={() => setIsCameraOpen(false)}
                        className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all"
                      >
                          <X size={24} />
                      </button>
                      
                      <button 
                        type="button"
                        onClick={capturePhoto}
                        className="p-1 rounded-full border-4 border-white/50 hover:border-white transition-all hover:scale-105"
                      >
                          <div className="w-16 h-16 bg-white rounded-full" />
                      </button>

                      <div className="w-12" /> {/* Spacer for layout balance */}
                  </div>
              </div>
              <p className="text-white/70 mt-4 text-sm font-medium">Position your pet in the frame</p>
          </div>
      )}
    </div>
  );
};

export default AddPet;