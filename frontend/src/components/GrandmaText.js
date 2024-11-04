import React from 'react';
import { Box, Typography } from '@mui/material';
import titleImage from '../images/title.png';

const GrandmaText = ({ text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Box
            component="img"
            sx={{
                height: 'auto',
                width: '50px',
                maxWidth: '100%',
                objectFit: 'contain',
            }}
            alt="タイトルおばあ"
            src={titleImage}
        />
        <Typography className="zen-maru-gothic-regular" variant="h4" component="h1">
            「{text}」
        </Typography>
    </Box>
);

export default GrandmaText;
