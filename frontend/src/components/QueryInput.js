import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const characterOptions = [
    { text: 'おばあ', color: '#FF8C00', hoverColor: '#FFA500' },
    { text: 'おとん', color: '#4682B4', hoverColor: '#5F9EA0' },
    { text: 'おにぃ', color: '#228B22', hoverColor: '#32CD32' },
    { text: 'わんこ', color: '#CD5C5C', hoverColor: '#F08080' },
];

const QueryInput = ({ query, setQuery, onSubmit, isLoading, character }) => {
    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            onSubmit(event);
        }
    };

    const selectedCharacter = characterOptions[character] || characterOptions[0];

    return (
        <Box sx={{ width: '100%', mt: 3, mb: 1 }}>
            <TextField
                fullWidth
                multiline
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="今日は朝名古屋駅から学校へ行って、2限に授業を受けて..."
                className="zen-maru-gothic-regular"
                sx={{ mb: 2 }}
                variant="outlined"
                disabled={isLoading}
            />
            <Button
                fullWidth
                variant="contained"
                onClick={onSubmit}
                className="zen-maru-gothic-regular"
                disabled={isLoading || !query.trim()}
                sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    backgroundColor: selectedCharacter.color,
                    color: 'white',
                    '&:hover': {
                        backgroundColor: selectedCharacter.hoverColor,
                    },
                    '&:disabled': {
                        backgroundColor: '#ccc',
                        color: '#666'
                    }
                }}
            >
                {isLoading
                    ? `${selectedCharacter.text}を呼んでいます...`
                    : `${selectedCharacter.text}を呼ぶ`}
            </Button>
        </Box>
    );
};

export default QueryInput;
