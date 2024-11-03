// src/components/LoadingIndicator.js
import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingIndicator = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress />
    </Box>
);

export default LoadingIndicator;
