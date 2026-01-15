import GoogleMap from '../components/GoogleMap';

export default function MapPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Find Pet Services Near You</h1>
      <GoogleMap 
        mode="search"
        location="veterinary+clinics"
        zoom={13}
        height="600px"
      />
    </div>
  );
}