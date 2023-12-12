import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Link } from 'react-router-dom';
import AccessoryDataService from "../../services/AccessoryService";

const Map = () => {
  const google = window.google;
  const mapRef = useRef(null);

  const [accessories, setAccessories] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  // get all recipes data
  useEffect(() => {
    retrieveAccessories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveAccessories = () => {
    AccessoryDataService.getAll()
      .then((response) => {
        const publishedAccessories = response.data.filter((accessory) => accessory.published);
        console.log(publishedAccessories);
        setAccessories(publishedAccessories);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Convert location to lat and lon
  const getLatLngFromAddress = async (address) => {
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    return { lat, lng };
  };

  // Map all locations and create pins
  useEffect(() => {
    const handleLocations = async () => {
      const markersWithLatLng = await Promise.all(
        accessories.map(async (accessory) => {
          const { lat, lng } = await getLatLngFromAddress(accessory.location);
          return {
            id: accessory.id,
            popupInfo: (
              <div className="popup">
                <div className="popupInfo">
                  <h5>{accessory.title}</h5>
                  {accessory.category} • {accessory.price} USD
                </div>
                <Link to={`/accessory/${accessory.id}`} className="btn btn-success btn-block btn-sm">
                  Details
                </Link>
              </div>
            ),
            position: { lat, lng },
          };
        })
      );
      setMapMarkers(markersWithLatLng);

      // Calculate the average latitude and longitude of all the markers and set it as the center
      const avgLat = markersWithLatLng.reduce((sum, marker) => sum + marker.position.lat, 0) / markersWithLatLng.length;
      const avgLng = markersWithLatLng.reduce((sum, marker) => sum + marker.position.lng, 0) / markersWithLatLng.length;
      setCenter({ lat: avgLat, lng: avgLng });
    };

    if (accessories.length > 0) {
      handleLocations();
    }
  }, [accessories]);


  useEffect(() => {
    if (mapMarkers.length > 0) {
      // Calculate the bounding box of all the markers
      const bounds = new google.maps.LatLngBounds();
      mapMarkers.forEach(({ position }) => bounds.extend(position));

      // Fit the map to the bounds of all the markers to adjust the zoom level
      const map = mapRef.current;
      map.fitBounds(bounds);
    }
  }, [mapMarkers, google.maps.LatLngBounds]);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  return (
    <GoogleMap
      onLoad={(map) => (mapRef.current = map)}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "100vw", height: "80vh" }}
      center={center}
    >
      {mapMarkers.map(({ id, popupInfo, position }) => (
        <Marker
          key={id}
          position={position}
          onClick={() => handleActiveMarker(id)}
        >
          {activeMarker === id ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>{popupInfo}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      ))}
    </GoogleMap>
  );
};

export default Map;
