import React, { useState } from 'react';
import { Box, Paper, Avatar, Typography, IconButton, Tooltip, Snackbar, CircularProgress } from '@mui/material';
import shareIcon from '../images/share.png';
import grandmaImage from '../images/grandma.png';

const ResponseList = ({ actions, feedbacks, diaryUrl, isLoadingAdditionalInfo }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [tooltipText, setTooltipText] = useState("大切な人に共有");

    if (!actions || actions.length === 0) {
        return null;
    }

    const handleShare = () => {
        const urlToCopy = `${window.location.origin}?${diaryUrl}`;

        navigator.clipboard.writeText(urlToCopy).then(() => {
            setOpenSnackbar(true);
            setTooltipText("コピー完了！");
            console.log('URLがクリップボードにコピーされました');
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
            {actions.map((action, index) => (
                <Paper key={index} elevation={3} sx={{ p: 2, mt: 2, width: '100%', bgcolor: '#e9e9e9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar
                            sx={{
                                bgcolor: feedbacks[index]?.face === 0 ? 'blue' :
                                    feedbacks[index]?.face === 1 ? 'orange' :
                                        feedbacks[index]?.face === 2 ? 'red' :
                                            feedbacks[index]?.face === 3 ? "black" : 'blue',
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
                            <Typography className="yuji-mai-regular" variant="h6">{action}</Typography>
                            {feedbacks[index] ? (
                                <Typography className="yuji-mai-regular" variant="body1">{feedbacks[index].feedback}</Typography>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    <Typography className="yuji-mai-regular">フィードバックを読み込み中...</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>
            ))}
            {isLoadingAdditionalInfo && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}
            <Tooltip title={tooltipText}>
                <IconButton onClick={handleShare}>
                    <img src={shareIcon} alt="共有" style={{ width: 24, height: 24 }} />
                </IconButton>
            </Tooltip>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="テキストがクリップボードにコピーされました"
            />
        </Box>
    );
};

export default ResponseList;
