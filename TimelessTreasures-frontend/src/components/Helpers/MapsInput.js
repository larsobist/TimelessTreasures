import { StandaloneSearchBox } from "@react-google-maps/api";
import { useRef } from "react";

const MapsInput = ({ onMeetingpointChange }) => {
  const inputRef = useRef();

  const handlePlaceChanged = async () => {
    const [place] = inputRef.current.getPlaces();
    if (place) {
      const formattedAddress = place.formatted_address;
      console.log(formattedAddress);
      onMeetingpointChange(formattedAddress); // Pass the formatted address to the parent component
    }
  };

  return (
    <StandaloneSearchBox
      onLoad={(ref) => (inputRef.current = ref)}
      onPlacesChanged={handlePlaceChanged}
    >
      <input
        type="text"
        className="form-control"
        placeholder="Treffpunkt eintippen..."
      />
    </StandaloneSearchBox>
  );
};

export default MapsInput;
