// components/NearbyPetServices.tsx
import React, { useState, useEffect } from 'react';
import GoogleMap from './GoogleMap';

const serviceTypes = [
  { value: 'pet stores', label: 'Pet Stores 🏪' },
  { value: 'veterinary clinics', label: 'Vet Hospitals 🏥' },
  { value: 'pet adoption', label: 'Adoption Centers 🐕' },
  { value: 'lost and found pets', label: 'Lost & Found 🕵️‍♂️' },
  { value: 'pet grooming', label: 'Grooming ✂️' },
  { value: 'dog parks', label: 'Dog Parks 🌳' },
  // Add/remove as you wish
];

const NearbyPetServices: React.FC = () => {
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(serviceTypes[0].value);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        () => {
          setError('Location access denied. Showing general area.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported.');
      setLoading(false);
    }
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        Find {serviceTypes.find(s => s.value === selectedService)?.label} Near You
      </h2>
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="serviceSelect" style={{ fontWeight: 500, marginRight: 8 }}>
          Service Type:
        </label>
        <select
          id="serviceSelect"
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 8, fontSize: 16 }}
        >
          {serviceTypes.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      {error && <div style={{ margin: '12px 0', color: '#c00' }}>⚠️ {error}</div>}
      <GoogleMap
        mode="search"
        location={coordinates ? `${selectedService} near ${coordinates.lat},${coordinates.lng}` : selectedService}
        height="450px"
      />
      <div style={{ fontSize: 14, color: '#666', marginTop: 16 }}>
        Your location is <strong>not stored</strong>, only used for showing nearby services.
      </div>
    </div>
  );
};

export default NearbyPetServices;