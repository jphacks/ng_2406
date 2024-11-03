// src/components/ResponseList.js
import React from 'react';
import { Box, Paper, Avatar, Typography } from '@mui/material';
import grandmaImage from '../images/grandma.png';

const ResponseList = ({ responses }) => (
    <Box>
        {responses.map((response, index) => (
            <Paper key={index} elevation={3} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar src={grandmaImage} alt="おばあ" sx={{ mr: 1 }} />
                    <Typography variant="h6">おばあ</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>{response.title}</Typography>
                <Typography variant="body1">{response.description}</Typography>
            </Paper>
        ))}
    </Box>
);

export default ResponseList;
