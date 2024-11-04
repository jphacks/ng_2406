import React from 'react';
import { Box, Typography } from '@mui/material';
import titleImage from '../images/title.png';

const GrandmaText = ({ text }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden',
            mt: 2
        }}
    >
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
        <Typography
            variant="h5"
            component="div"
            sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                fontFamily: '"Zen Maru Gothic", sans-serif',
            }}
        >
            「{text}」
        </Typography>
    </Box>
);

export default GrandmaText;
