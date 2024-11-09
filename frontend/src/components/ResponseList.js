import React, { useState } from 'react';
import { Box, Paper, Avatar, Typography, IconButton, Tooltip, Snackbar } from '@mui/material';
import shareIcon from '../images/share.png';
import grandmaImage from '../images/grandma.png';

const ResponseList = ({ actions, feedbacks, diaryUrl }) => {
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
            {feedbacks.map((feedback, index) => (
                <Paper key={index} elevation={3} sx={{ my: 2, p: 2 }}>
                    <Box display="flex" alignItems="center">
                        <Avatar src={grandmaImage} alt="おばあ" sx={{ mr: 2 }} />
                        <Typography variant="h6">{feedback.action}</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {feedback.feedback}
                    </Typography>
                </Paper>
            ))}
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
