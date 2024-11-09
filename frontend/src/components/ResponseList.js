import React, { useState, useCallback, useEffect } from 'react';
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
        const textToCopy = `日記URL: ${window.location.origin}/diary/${diaryUrl}\n\n` +
            feedbacks.map(feedback =>
                `${feedback.action}\n${feedback.feedback}`
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
        <Box>
            {actions.map((action, index) => (
                <Paper key={index} elevation={3} sx={{ my: 2, p: 2 }}>
                    <Typography variant="h6">{action}</Typography>
                    {feedbacks[index] ? (
                        <Typography>{feedbacks[index].feedback}</Typography>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            <Typography>フィードバックを読み込み中...</Typography>
                        </Box>
                    )}
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
