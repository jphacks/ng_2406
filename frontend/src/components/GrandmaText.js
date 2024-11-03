import React from 'react';
import { Box, Typography } from '@mui/material';
import titleImage from '../images/title.png';
const GrandmaText = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mt:2}}>
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
            「今日の予定を教えておくれ」
        </Typography>
    </Box>
);

export default GrandmaText;
