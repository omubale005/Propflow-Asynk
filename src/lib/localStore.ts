import { useEffect, useMemo, useState } from 'react';

interface StoredState<T> {
  added: T[];
  removed: string[];
}

function readState<T>(key: string): StoredState<T> {
  const fallback: StoredState<T> = { added: [], removed: [] };
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as StoredState<T>;
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      removed: Array.isArray(parsed.removed) ? parsed.removed : [],
    };
  } catch {
    return fallback;
  }
}

export function useLocalEntityStore<T extends { id: string }>(key: string, baseItems: T[]) {
  const [added, setAdded] = useState<T[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);

  useEffect(() => {
    const { added: storedAdded, removed: storedRemoved } = readState<T>(key);
    setAdded(storedAdded);
    setRemoved(storedRemoved);
  }, [key]);

  useEffect(() => {
    const payload: StoredState<T> = { added, removed };
    localStorage.setItem(key, JSON.stringify(payload));
  }, [key, added, removed]);

  const items = useMemo(() => {
    const removedSet = new Set(removed);
    const baseFiltered = baseItems.filter(item => !removedSet.has(item.id));
    const addedFiltered = added.filter(item => !removedSet.has(item.id));

    const merged = new Map<string, T>();
    baseFiltered.forEach(item => merged.set(item.id, item));
    addedFiltered.forEach(item => merged.set(item.id, item));

    const orderedAdded = addedFiltered.filter(item => merged.has(item.id));
    const orderedBase = baseFiltered.filter(item => !addedFiltered.find(a => a.id === item.id));

    return [...orderedAdded, ...orderedBase];
  }, [added, removed, baseItems]);

  const addItem = (item: T) => {
    setAdded(prev => [item, ...prev]);
    setRemoved(prev => prev.filter(id => id !== item.id));
  };

  const removeItem = (id: string) => {
    setRemoved(prev => (prev.includes(id) ? prev : [...prev, id]));
    setAdded(prev => prev.filter(item => item.id !== id));
  };

  return { items, addItem, removeItem };
}
