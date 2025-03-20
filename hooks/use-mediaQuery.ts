"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Définir la valeur initiale
    setMatches(media.matches);

    // Callback pour les changements de media query
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ajouter le listener
    media.addEventListener("change", listener);

    // Nettoyer le listener
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
