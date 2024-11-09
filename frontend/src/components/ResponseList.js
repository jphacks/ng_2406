import React from 'react';
import { Box, Paper, Avatar, Typography, IconButton, Tooltip } from '@mui/material';
import shareIcon from '../images/share.png';
import grandmaImage from '../images/grandma.png';

const ResponseList = ({ aiResponses }) => {
    if (!aiResponses || aiResponses.length === 0) {
        return null;
    }

    const handleShare = () => {
        console.log('共有ボタンがクリックされました');
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            {aiResponses.map((response, index) => (
                <Paper key={index} elevation={3} sx={{ p: 2, mt: 2, width: '100%', bgcolor: '#e9e9e9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar
                            sx={{
                                bgcolor: response.face === 0 ? 'blue' :
                                    response.face === 1 ? 'orange' :
                                        response.face === 2 ? 'red' :
                                            response.face === 3 ? "black" : 'blue',
                                mr: 2,
                                width: 56,
                                height: 56
                            }}
                            src={grandmaImage}
                            alt="おばあちゃん"
                        >
                            おばあ
                        </Avatar>
                        <Box>
                            <Typography className="yuji-mai-regular" variant="h6">{response.title}</Typography>
                            <Typography className="yuji-mai-regular" variant="body1">{response.description}</Typography>
                        </Box>
                    </Box>
                </Paper>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                <Tooltip
                    title="大切な人に共有！"
                    open={true}
                    placement="right"
                    arrow
                    sx={{
                        alignItems: 'center',
                        '& .MuiTooltip-tooltip': {
                            backgroundColor: 'white',
                            color: 'black',
                            border: '2px solid black',
                            borderRadius: '15px',
                            padding: '8px 12px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        },
                        '& .MuiTooltip-arrow': {
                            color: 'white',
                            '&::before': {
                                border: '2px solid black',
                                backgroundColor: 'white',
                            },
                        },
                    }}
                >
                    <IconButton
                        onClick={handleShare}
                        sx={{
                            width: 32,
                            height: 32,
                            padding: 0,
                            bgcolor: 'transparent',
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                        }}
                    >
                        <img
                            src={shareIcon}
                            alt="共有"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default ResponseList;
