import React from 'react';

interface GoogleMapProps {
  mode?: 'place' | 'view' | 'directions' | 'streetview' | 'search';
  location?: string;
  zoom?: number;
  width?: string;
  height?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  mode = 'place',
  location = 'Mumbai',
  zoom = 14,
  width = '100%',
  height = '450px'
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Build URL based on mode
  let mapUrl = '';
  
  if (mode === 'search') {
    mapUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(location)}`;
  } else if (mode === 'place') {
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`;
  } else if (mode === 'view') {
    mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${location}&zoom=${zoom}`;
  } else if (mode === 'directions') {
    mapUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&${location}`;
  } else if (mode === 'streetview') {
    mapUrl = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${location}`;
  }

  return (
    <iframe
      width={width}
      height={height}
      style={{ border: 0, borderRadius: '8px' }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={mapUrl}
    />
  );
};

export default GoogleMap;