"use client";

import { useState, useEffect, useCallback } from "react";

const useCharacter = (initialState = 0) => {
  const [character, setCharacter] = useState(initialState);
  const [lastCharacter, setLastCharacter] = useState(initialState);
  const [hasChangedCharacter, setHasChangedCharacter] = useState(false);

  // マウント後にlocalStorageから復元（SSRとの不一致を防ぐ）
  useEffect(() => {
    const saved = localStorage.getItem("character");
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (parsed >= 0 && parsed <= 3) setCharacter(parsed);
    }
    if (localStorage.getItem("hasChangedCharacter") === "true") {
      setHasChangedCharacter(true);
    }
  }, []);

  useEffect(() => {
    if (character < 0 || character > 3) {
      console.error("キャラクター値が範囲外です:", character);
      return;
    }
    localStorage.setItem("character", String(character));
  }, [character]);

  const handleCharacterChange = useCallback(
    (index: number) => {
      if (!hasChangedCharacter) {
        setHasChangedCharacter(true);
        localStorage.setItem("hasChangedCharacter", "true");
      }

      if (index !== character) {
        setLastCharacter(character);
        setCharacter(index);
        return true;
      }
      return false;
    },
    [character, hasChangedCharacter]
  );

  return {
    character,
    setCharacter,
    lastCharacter,
    hasChangedCharacter,
    handleCharacterChange,
  };
};

export default useCharacter;
