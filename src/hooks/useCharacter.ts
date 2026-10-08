"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isValidCharacter } from "@/lib/diary";

const LOCAL_STORAGE_EVENT = "character-storage-change";

function getLocalStorageValue(key: string): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(key);
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_STORAGE_EVENT, callback);
  };
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
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

  let character = initialState;
  if (savedCharacter !== null) {
    const n = parseInt(savedCharacter, 10);
    if (isValidCharacter(n)) character = n;
  }
  const hasChangedCharacter = savedHasChanged === "true";

  const setCharacter = useCallback((value: number) => {
    if (isValidCharacter(value)) {
      setLocalStorage("character", String(value));
    }
  }, []);

  const handleCharacterChange = useCallback(
    (index: number) => {
      if (!hasChangedCharacter) {
        setLocalStorage("hasChangedCharacter", "true");
      }
      if (index !== character && isValidCharacter(index)) {
        setLocalStorage("character", String(index));
        return true;
      }
      return false;
    },
    [character, hasChangedCharacter]
  );

  return {
    character,
    setCharacter,
    hasChangedCharacter,
    handleCharacterChange,
  };
};

export default useCharacter;
