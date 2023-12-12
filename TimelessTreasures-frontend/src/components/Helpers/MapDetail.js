import { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

const MapDetail = (props) => {
  const { location } = props;

  const containerStyle = {
    width: '400px',
    height: '340px'
  };

  const [mapsLocation, setMapLocation] = useState(null);

  useEffect(() => {
    if (location && location.meetingPlace) {
      handleLocation(location.meetingPlace);
    }
  }, [location]);

  const handleLocation = async (address) => {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setMapLocation({ lat, lng });
  };

  return (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapsLocation}
          zoom={12}
        >
          <Marker position={mapsLocation}></Marker>
        </GoogleMap>
  );
};


export default MapDetail;