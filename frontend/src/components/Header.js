import React from 'react';
import { Typography, Box } from '@mui/material';
import titleImage from '../images/title.png';

const Header = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img src={titleImage} alt="タイトル" style={{ width: '100%', maxWidth: '400px', marginBottom: '20px' }} />
        <Typography variant="h4" component="h1" gutterBottom className="zen-maru-gothic-regular">
            安心問診おばあ
        </Typography>
    </Box>
);

export default Header;
