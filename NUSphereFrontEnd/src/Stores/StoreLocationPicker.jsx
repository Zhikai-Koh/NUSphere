import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./StoreLocationPicker.css";

const NUS_MAP_CENTRE = [1.2966, 103.7764];

const locationMarkerIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
});

function MoveMapToLocation({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 17);
        }
    }, [map, position]);

    return null;
}

function LocationMarker({ position, onPositionChange, editable }) {
    useMapEvents(editable ? {
        click(event) {
            onPositionChange({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        },
    } : {});

    if (!position) {
        return null;
    }

    return (
        <Marker
            draggable={editable}
            position={position}
            icon={locationMarkerIcon}
            eventHandlers={editable ? {
                dragend(event) {
                    const markerPosition = event.target.getLatLng();
                    onPositionChange({
                        latitude: markerPosition.lat,
                        longitude: markerPosition.lng,
                    });
                },
            } : {}}
        />
    );
}

export function StoreLocationPicker({
    locationName,
    onLocationNameChange,
    location,
    onLocationChange,
    editable = true,
    inputId = "store-location-name",
}) {
    const [locationError, setLocationError] = useState("");
    const [findingLocation, setFindingLocation] = useState(false);

    const markerPosition = useMemo(
        () => location ? [location.latitude, location.longitude] : null,
        [location]
    );

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Your browser does not support location access.");
            return;
        }

        setFindingLocation(true);
        setLocationError("");

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                onLocationChange({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                setFindingLocation(false);
            },
            () => {
                setLocationError("Location access failed. Select the location directly on the map instead.");
                setFindingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div className="store-location-picker">
            <label htmlFor={editable ? inputId : undefined}>Store location</label>
            {editable ? (
                <>
                    <input
                        id={inputId}
                        type="text"
                        placeholder="Location name, e.g. UTown Residence Lobby"
                        value={locationName}
                        onChange={(event) => onLocationNameChange(event.target.value)}
                        required
                    />
                    <button type="button" onClick={useCurrentLocation} disabled={findingLocation}>
                        {findingLocation ? "Finding Location..." : "Use My Current Location"}
                    </button>
                    {locationError && <p className="store-location-error">{locationError}</p>}
                </>
            ) : (
                <p className="store-location-name">{locationName || "No location set"}</p>
            )}

            <MapContainer
                center={markerPosition || NUS_MAP_CENTRE}
                zoom={markerPosition ? 17 : 15}
                scrollWheelZoom={editable}
                className="store-location-map"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MoveMapToLocation position={markerPosition} />
                <LocationMarker
                    position={markerPosition}
                    onPositionChange={onLocationChange}
                    editable={editable}
                />
            </MapContainer>
            {editable && (
                <p className="store-location-selection">
                    {location ? "Location selected" : "Select a location on the map"}
                </p>
            )}
        </div>
    );
}
