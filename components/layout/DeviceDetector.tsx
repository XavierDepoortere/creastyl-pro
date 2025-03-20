"use client";

import { useEffect, useState } from "react";

interface DeviceDetectorProps {
  mobileComponent: React.ReactNode;
  desktopComponent: React.ReactNode;
}

export function DeviceDetector({
  mobileComponent,
  desktopComponent,
}: DeviceDetectorProps) {
  // Commence avec null pour éviter les erreurs d'hydratation
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Fonction pour vérifier la taille de l'écran
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Faire la vérification initiale
    checkDeviceType();

    // Configurer l'écouteur d'événement pour les changements de taille
    window.addEventListener("resize", checkDeviceType);

    // Nettoyer
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  // Rendu conditionnel basé sur l'état
  if (isMobile === null) {
    // État initial (avant hydratation côté client)
    return null;
  }

  // Retourne le composant approprié
  return isMobile ? mobileComponent : desktopComponent;
}
