import { useState } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
}

export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied" | "unsupported">("idle");
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(nextCoords);
        setStatus("granted");
        setError(null);
      },
      () => {
        setStatus("denied");
        setError("Location access is disabled. Search a location manually.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 }
    );
  };

  return { coords, status, error, requestLocation };
};
