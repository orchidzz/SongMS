import ngeohash from "ngeohash";

const EARTH_RADIUS_KM = 6371; // Earth's radius in km

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c;
};

/*
 * Calculates distance between 2 geohashes in km
 */
export const distanceBetweenGeohashes = (geohash1, geohash2) => {
    try {
        const coord1 = ngeohash.decode(geohash1);
        const lat1 = coord1.latitude;
        const lon1 = coord1.longitude;
        const coord2 = ngeohash.decode(geohash2);
        const lat2 = coord2.latitude;
        const lon2 = coord2.longitude;

        return haversineDistance(lat1, lon1, lat2, lon2);
    } catch (error) {
        console.error("Error decoding geohashes:", error);
        return null;
    }
};
