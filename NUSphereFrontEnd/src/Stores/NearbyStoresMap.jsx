import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { buildGoogleMapsUrl, hasMapLocation } from "../utils/googleMaps.js";

const NUS_MAP_CENTRE = [1.2966, 103.7764];

const storeMarkerIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const buyerMarkerIcon = L.divIcon({
    className: "buyer-location-marker",
    html: '<span></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
});

function SelectBuyerLocation({ onLocationChange }) {
    useMapEvents({
        click(event) {
            onLocationChange({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        },
    });

    return null;
}

function MoveToBuyer({ buyerLocation }) {
    const map = useMap();

    useEffect(() => {
        if (buyerLocation) {
            map.setView([buyerLocation.latitude, buyerLocation.longitude], 16);
        }
    }, [buyerLocation, map]);

    return null;
}

function calculateDistance(origin, destination) {
    const earthRadiusKm = 6371;
    const toRadians = (degrees) => degrees * Math.PI / 180;
    const latitudeDifference = toRadians(destination.latitude - origin.latitude);
    const longitudeDifference = toRadians(destination.longitude - origin.longitude);
    const originLatitude = toRadians(origin.latitude);
    const destinationLatitude = toRadians(destination.latitude);

    const haversine = Math.sin(latitudeDifference / 2) ** 2
        + Math.cos(originLatitude) * Math.cos(destinationLatitude)
        * Math.sin(longitudeDifference / 2) ** 2;

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function formatDistance(distanceKm) {
    if (distanceKm == null) {
        return "Select your location for distance";
    }

    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m away`;
    }

    return `${distanceKm.toFixed(1)} km away`;
}

export function NearbyStoresMap({ stores, onVisitStore }) {
    const [buyerLocation, setBuyerLocation] = useState(null);
    const [locationError, setLocationError] = useState("");
    const [findingLocation, setFindingLocation] = useState(false);

    const mappedStores = useMemo(() => stores
        .filter(hasMapLocation)
        .map((store) => {
            const storeLocation = {
                latitude: Number(store.latitude),
                longitude: Number(store.longitude),
            };

            return {
                ...store,
                storeLocation,
                distanceKm: buyerLocation ? calculateDistance(buyerLocation, storeLocation) : null,
            };
        })
        .sort((firstStore, secondStore) => {
            if (firstStore.distanceKm == null || secondStore.distanceKm == null) {
                return firstStore.store_name.localeCompare(secondStore.store_name);
            }
            return firstStore.distanceKm - secondStore.distanceKm;
        }), [buyerLocation, stores]);

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Your browser does not support location access.");
            return;
        }

        setFindingLocation(true);
        setLocationError("");

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setBuyerLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
                setFindingLocation(false);
            },
            () => {
                setLocationError("Location access failed. Select your starting point on the map instead.");
                setFindingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    if (mappedStores.length === 0) {
        return (
            <div className="no-stores-message">
                <p>No stores with map locations match the current filters.</p>
            </div>
        );
    }

    return (
        <div className="nearby-stores-view">
            <div className="nearby-location-controls">
                <button type="button" onClick={useCurrentLocation} disabled={findingLocation}>
                    {findingLocation ? "Finding Location..." : "Use My Current Location"}
                </button>
                <span>{buyerLocation ? "Starting point selected" : "Click the map to choose a starting point"}</span>
            </div>
            {locationError && <p className="nearby-location-error">{locationError}</p>}

            <div className="nearby-stores-layout">
                <MapContainer
                    center={NUS_MAP_CENTRE}
                    zoom={15}
                    scrollWheelZoom
                    className="nearby-stores-map"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <SelectBuyerLocation onLocationChange={setBuyerLocation} />
                    <MoveToBuyer buyerLocation={buyerLocation} />
                    {buyerLocation && (
                        <Marker
                            position={[buyerLocation.latitude, buyerLocation.longitude]}
                            icon={buyerMarkerIcon}
                        >
                            <Popup>Your starting point</Popup>
                        </Marker>
                    )}
                    {mappedStores.map((store) => (
                        <Marker
                            key={store.id}
                            position={[store.storeLocation.latitude, store.storeLocation.longitude]}
                            icon={storeMarkerIcon}
                        >
                            <Popup>
                                <div className="store-map-popup">
                                    <strong>{store.store_name}</strong>
                                    <span>{store.location_name}</span>
                                    <span>{formatDistance(store.distanceKm)}</span>
                                    <a
                                        href={buildGoogleMapsUrl(store.latitude, store.longitude)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Show on Google Maps
                                    </a>
                                    <button type="button" onClick={() => onVisitStore(store.id)}>Visit Store</button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                <div className="nearby-store-list">
                    {mappedStores.map((store) => (
                        <div key={store.id} className="nearby-store-row">
                            <div>
                                <strong>{store.store_name}</strong>
                                <span>{store.location_name}</span>
                                <span>{formatDistance(store.distanceKm)}</span>
                            </div>
                            <div className="nearby-store-actions">
                                <a
                                    href={buildGoogleMapsUrl(store.latitude, store.longitude)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Show on Google Maps
                                </a>
                                <button type="button" onClick={() => onVisitStore(store.id)}>Visit Store</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
