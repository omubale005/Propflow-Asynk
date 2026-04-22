import { useEffect, useMemo, useState } from "react";

function readState(key) {
  const fallback = { added: [], removed: [] };
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      removed: Array.isArray(parsed.removed) ? parsed.removed : [],
    };
  } catch {
    return fallback;
  }
}

export function useLocalEntityStore(key, baseItems) {
  const [added, setAdded] = useState([]);
  const [removed, setRemoved] = useState([]);

  useEffect(() => {
    const { added: storedAdded, removed: storedRemoved } = readState(key);
    setAdded(storedAdded);
    setRemoved(storedRemoved);
  }, [key]);

  useEffect(() => {
    const payload = { added, removed };
    localStorage.setItem(key, JSON.stringify(payload));
  }, [key, added, removed]);

  const items = useMemo(() => {
    const removedSet = new Set(removed);
    const baseFiltered = baseItems.filter((item) => !removedSet.has(item.id));
    const addedFiltered = added.filter((item) => !removedSet.has(item.id));

    const merged = new Map();
    baseFiltered.forEach((item) => merged.set(item.id, item));
    addedFiltered.forEach((item) => merged.set(item.id, item));

    const orderedAdded = addedFiltered.filter((item) => merged.has(item.id));
    const orderedBase = baseFiltered.filter(
      (item) => !addedFiltered.find((a) => a.id === item.id),
    );

    return [...orderedAdded, ...orderedBase];
  }, [added, removed, baseItems]);

  const addItem = (item) => {
    setAdded((prev) => [item, ...prev]);
    setRemoved((prev) => prev.filter((id) => id !== item.id));
  };

  const removeItem = (id) => {
    setRemoved((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setAdded((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, addItem, removeItem };
}
