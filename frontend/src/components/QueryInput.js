// src/components/QueryInput.js
import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const QueryInput = ({ query, setQuery, onSubmit, isLoading }) => {
    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            onSubmit(event);
        }
    };

    return (
        <Box component="form" onSubmit={onSubmit} sx={{ mb: 2 }}>
            <TextField
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="「今日の予定を教えておくれ」"
                className="zen-maru-gothic-regular"
                sx={{ mb: 1 }}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
            >
                {isLoading ? 'おばあを呼んでいます...' : 'おばあを呼ぶ'}
            </Button>
        </Box>
    );
};

export default QueryInput;
