"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

const PWAInstallContext = createContext<{ deferredPrompt: any }>({ deferredPrompt: null });

export const usePWAInstall = () => useContext(PWAInstallContext);

export const PWAInstallProvider = ({ children }: { children: React.ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <PWAInstallContext.Provider value={{ deferredPrompt }}>
      {children}
    </PWAInstallContext.Provider>
  );
};
