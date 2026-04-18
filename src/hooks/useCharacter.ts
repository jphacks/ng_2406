"use client";

import { useState, useCallback, useSyncExternalStore } from "react";

function getLocalStorageValue(key: string): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(key);
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const useCharacter = (initialState = 0) => {
  const savedCharacter = useSyncExternalStore(
    subscribeToStorage,
    () => getLocalStorageValue("character"),
    () => null
  );
  const savedHasChanged = useSyncExternalStore(
    subscribeToStorage,
    () => getLocalStorageValue("hasChangedCharacter"),
    () => null
  );

  const initialCharacter =
    savedCharacter !== null ? parseInt(savedCharacter, 10) : initialState;

  const [character, setCharacter] = useState(
    initialCharacter >= 0 && initialCharacter <= 3 ? initialCharacter : initialState
  );
  const [lastCharacter, setLastCharacter] = useState(initialState);
  const [hasChangedCharacter, setHasChangedCharacter] = useState(
    savedHasChanged === "true"
  );

  const updateCharacter = useCallback(
    (value: number) => {
      if (value >= 0 && value <= 3) {
        setCharacter(value);
        localStorage.setItem("character", String(value));
      }
    },
    []
  );

  const handleCharacterChange = useCallback(
    (index: number) => {
      if (!hasChangedCharacter) {
        setHasChangedCharacter(true);
        localStorage.setItem("hasChangedCharacter", "true");
      }

      if (index !== character) {
        setLastCharacter(character);
        updateCharacter(index);
        return true;
      }
      return false;
    },
    [character, hasChangedCharacter, updateCharacter]
  );

  return {
    character,
    setCharacter: updateCharacter,
    lastCharacter,
    hasChangedCharacter,
    handleCharacterChange,
  };
};

export default useCharacter;
