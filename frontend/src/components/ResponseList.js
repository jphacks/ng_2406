import React, { useState, useEffect } from 'react';
import { Box, Paper, Avatar, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material';
import shareIcon from '../images/share.png';
import XIcon from '@mui/icons-material/X';

// theme.jsからインポート
import { CHARACTER_OPTIONS, FACE_COLORS } from '../constants/theme';

const ResponseList = ({ actions, feedbacks, diaryUrl, character }) => {
    const [tooltipText, setTooltipText] = useState("大切な人に共有");
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    
    const selectedCharacter = CHARACTER_OPTIONS[character] || CHARACTER_OPTIONS[0];
    const selectedFont = selectedCharacter.font;
    
    const basePath = '/ng_2406';
    const shareUrl = `${window.location.origin + basePath}?diary=${diaryUrl}`;
    
    useEffect(() => {
        let timeoutId;
        if (tooltipText === "コピー完了！") {
            setIsTooltipOpen(true);
            timeoutId = setTimeout(() => {
                setTooltipText("大切な人に共有");
                setIsTooltipOpen(false);
            }, 3000);
        }
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [tooltipText]);

    if (!actions || actions.length === 0) {
        return null;
    }

    const handleShare = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setTooltipText("コピー完了！");
        }, (err) => {
            console.error('クリップボードへのコピーに失敗しました', err);
        });
    };

    const handleXPost = () => {
        const text = encodeURIComponent(`安心打診${selectedCharacter.alt}からの伝言です...！ #JPHACKS2024 #安心打診おばあ`);
        const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Xでポスト" placement="left" arrow>
                    <IconButton onClick={handleXPost} sx={{ mr: 1 }}>
                        <XIcon style={{ width: 20, height: 20 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={tooltipText} placement="right" arrow open={isTooltipOpen}>
                    <IconButton onClick={handleShare}>
                        <img src={shareIcon} alt="共有" style={{ width: 24, height: 24 }} />
                    </IconButton>
                </Tooltip>
            </Box>
            {actions.map((action, index) => (
                <Paper key={index} elevation={3} sx={{ p: 2, mt: 2, width: '100%', bgcolor: '#f5f5f5' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar
                            sx={{
                                bgcolor: FACE_COLORS[feedbacks[index]?.face] || FACE_COLORS[3],
                                mr: 2,
                                width: 56,
                                height: 56
                            }}
                            src={selectedCharacter.altSrc}
                            alt={selectedCharacter.alt}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: selectedFont,
                                    '&.MuiTypography-root': { fontFamily: selectedFont }
                                }}
                            >
                                {action}
                            </Typography>
                            {feedbacks[index] ? (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: selectedFont,
                                        '&.MuiTypography-root': { fontFamily: selectedFont }
                                    }}
                                >
                                    {feedbacks[index].feedback}
                                </Typography>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    <Typography sx={{ fontFamily: selectedFont }}>フィードバックを読み込み中...</Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default ResponseList;
