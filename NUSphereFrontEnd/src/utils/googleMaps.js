export function buildGoogleMapsUrl(latitude, longitude) {
    const parameters = new URLSearchParams({
        api: "1",
        query: `${latitude},${longitude}`,
    });

    return `https://www.google.com/maps/search/?${parameters.toString()}`;
}

export function hasMapLocation(item) {
    return Boolean(
        item.location_name
        && item.latitude != null
        && item.longitude != null
        && Number.isFinite(Number(item.latitude))
        && Number.isFinite(Number(item.longitude))
    );
}
