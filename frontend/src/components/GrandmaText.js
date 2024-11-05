import React from 'react';
import { Box, Typography } from '@mui/material';
import titleImage from '../images/title.png';

const GrandmaText = ({ isResponseDisplayed }) => {
    const handleClick = () => {
        console.log('画像がクリックされました');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box
                sx={{
                    position: 'relative',
                    width: '50px',
                    height: '50px',
                    marginRight: 2,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 165, 0, 0.6)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                        zIndex: 1,
                        ...(isResponseDisplayed && {
                            animation: 'pulse 2s infinite',
                        }),
                    },
                    '&:hover::before': {
                        opacity: isResponseDisplayed ? 0 : 1,
                    },
                    '@keyframes pulse': {
                        '0%': { opacity: 0 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0 },
                    },
                }}
            >
                <Box
                    component="img"
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        cursor: 'pointer',
                        zIndex: 2,
                    }}
                    onClick={handleClick}
                    alt="タイトルおばあ"
                    src={titleImage}
                />
            </Box>
            <Typography className="zen-maru-gothic-regular" variant="h4" component="h1">
                「今日の予定を教えておくれ」
            </Typography>
        </Box>
    );
};

export default GrandmaText;
