import React, { useState } from 'react';
import { Box, Paper, Avatar, Typography, IconButton, Tooltip, Snackbar } from '@mui/material';
import shareIcon from '../images/share.png';
import grandmaImage from '../images/grandma.png';

const ResponseList = ({ }) => {
    //const ResponseList = ({ aiResponses }) => {

    let aiResponses = {

        "actions": ["図書館に行った", "論理学の課題をやった"],
        "diary_id": "fasiFKja"

    }
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [tooltipText, setTooltipText] = useState("大切な人に共有");



    if (!aiResponses || aiResponses.length === 0) {
        return null;
    }

    const handleShare = () => {
        const textToCopy = aiResponses.map(response =>
            `${response.actions}\n${response.actions}`
        ).join('\n\n');

        navigator.clipboard.writeText(textToCopy).then(() => {
            setOpenSnackbar(true);
            setTooltipText("コピー完了！");
            console.log('テキストがクリップボードにコピーされました');

            setTimeout(() => {
                setTooltipText("大切な人に共有！");
            }, 3000);
        }, (err) => {
            console.error('クリップボードへのコピーに失敗しました', err);
        });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
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
                    title={tooltipText}
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
