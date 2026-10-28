'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Prefs = { showVi: boolean; toggleVi: () => void };

const PrefsContext = createContext<Prefs>({ showVi: true, toggleVi: () => {} });
const KEY = 'ag-show-vi';

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [showVi, setShowVi] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === '0') setShowVi(false);
    } catch {}
  }, []);

  const toggleVi = useCallback(() => {
    setShowVi((prev) => {
      try {
        localStorage.setItem(KEY, prev ? '0' : '1');
      } catch {}
      return !prev;
    });
  }, []);

  return <PrefsContext.Provider value={{ showVi, toggleVi }}>{children}</PrefsContext.Provider>;
}

export const usePrefs = () => useContext(PrefsContext);
