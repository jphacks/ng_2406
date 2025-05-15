import { useState, useEffect } from 'react';

const useCharacter = (initialState = 0) => {
    const [character, setCharacter] = useState(() => {
        const savedCharacter = localStorage.getItem('character');
        return savedCharacter !== null ? parseInt(savedCharacter, 10) : initialState;
    });

    const [lastCharacter, setLastCharacter] = useState(initialState);

    const [hasChangedCharacter, setHasChangedCharacter] = useState(() => {
        return localStorage.getItem('hasChangedCharacter') === 'true';
    });

    useEffect(() => {
        if (character < 0 || character > 3) {
            console.error('キャラクター値が範囲外です:', character);
            return;
        }
        localStorage.setItem('character', character);
    }, [character]);

    const handleCharacterChange = (index) => {
        if (!hasChangedCharacter) {
            setHasChangedCharacter(true);
            localStorage.setItem('hasChangedCharacter', 'true');
        }

        if (index !== character) {
            setLastCharacter(character);
            setCharacter(index);
            return true; // キャラクターが変更されたことを示す
        }
        return false; // キャラクターが変更されなかったことを示す
    };

    return {
        character,
        setCharacter, // setCharacter関数をエクスポート
        lastCharacter,
        hasChangedCharacter,
        handleCharacterChange,
    };
};

export default useCharacter;
