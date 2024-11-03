import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const QueryInput = ({ query, setQuery, onSubmit, isLoading }) => {
    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            onSubmit(event);
        }
    };

    return (
        <Box sx={{ width: '100%', mt: 3, mb: 2 }}>
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
            />
            <Button
                fullWidth
                variant="contained"
                onClick={onSubmit}
                className="zen-maru-gothic-regular"
                disabled={isLoading}
                sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                }}
            >
                {isLoading ? 'おばあを呼んでいます...' : 'おばあを呼ぶ'}
            </Button>
        </Box>
    );
};

export default QueryInput;
