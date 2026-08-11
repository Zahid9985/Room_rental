import { useCallback, useEffect, useState } from "react";
import type { Property } from "../api/types";

const STORAGE_KEY = "ssSavedProperties";

export const useSavedProperties = () => {
  const [saved, setSaved] = useState<Property[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setSaved(raw ? JSON.parse(raw) : []);
  }, []);

  const persist = (items: Property[]) => {
    setSaved(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const isSaved = useCallback(
    (id: string) => saved.some((property) => property.id === id),
    [saved]
  );

  const toggleSaved = (property: Property) => {
    const next = isSaved(property.id)
      ? saved.filter((item) => item.id !== property.id)
      : [{ ...property }, ...saved];
    persist(next);
  };

  const removeSaved = (id: string) => {
    persist(saved.filter((property) => property.id !== id));
  };

  return { saved, isSaved, toggleSaved, removeSaved };
};
