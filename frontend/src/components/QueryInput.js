import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const QueryInput = ({ query, setQuery, onSubmit, isLoading }) => {
    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            onSubmit(event);
        }
    };

    return (
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1, mb: 2 }}>
            <TextField
                fullWidth
                margin='normal'
                value={query}
                multiline
                rows={3}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="今日は朝名古屋駅から学校へ行って、2限に授業を受けて..."
                className="zen-maru-gothic-regular"
                sx={{ mb: 1 }}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
                fullWidth
                className="zen-maru-gothic-regular"
            >
                {isLoading ? 'おばあを呼んでいます...' : 'おばあを呼ぶ'}
            </Button>
        </Box>
    );
};

export default QueryInput;
