import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./LocationPicker.css";
import { buildGoogleMapsUrl } from "../utils/googleMaps.js";

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

export function LocationPicker({
    locationName,
    onLocationNameChange,
    location,
    onLocationChange,
    editable = true,
    inputId = "location-name",
    label = "Location",
    placeholder = "Location name",
    showGoogleMapsLink = false,
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
        <div className="location-picker">
            <label htmlFor={editable ? inputId : undefined}>{label}</label>
            {editable ? (
                <>
                    <input
                        id={inputId}
                        type="text"
                        placeholder={placeholder}
                        value={locationName}
                        onChange={(event) => onLocationNameChange(event.target.value)}
                        required
                    />
                    <button type="button" onClick={useCurrentLocation} disabled={findingLocation}>
                        {findingLocation ? "Finding Location..." : "Use My Current Location"}
                    </button>
                    {locationError && <p className="location-picker-error">{locationError}</p>}
                </>
            ) : (
                <>
                    <p className="location-picker-name">{locationName || "No location set"}</p>
                    {showGoogleMapsLink && location && (
                        <a
                            className="location-picker-google-link"
                            href={buildGoogleMapsUrl(location.latitude, location.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Show on Google Maps
                        </a>
                    )}
                </>
            )}

            <MapContainer
                center={markerPosition || NUS_MAP_CENTRE}
                zoom={markerPosition ? 17 : 15}
                scrollWheelZoom={editable}
                className="location-picker-map"
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
                <p className="location-picker-selection">
                    {location ? "Location selected" : "Select a location on the map"}
                </p>
            )}
        </div>
    );
}
