import React, { useState } from 'react';
import { Box, Typography, Modal, useMediaQuery, useTheme } from '@mui/material';
import { CHARACTER_OPTIONS } from '../constants/theme';

const GrandmaText = ({ 
    text, 
    isResponseDisplayed, 
    onCharacterChange, 
    character, 
    isLoading, 
    shouldPulse 
}) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpen = () => {
        if (!isLoading) {
            setOpen(true);
        }
    };
    
    const handleClose = () => setOpen(false);
    
    const handleCharacterSelect = (index) => {
        if (!isLoading) {
            onCharacterChange(index);
            handleClose();
        }
    };

    const renderCharacterSelector = () => (
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 280,
            bgcolor: 'background.paper',
            boxShadow: 24,
            py: 2,
            px: 2,
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            gap: 2,
            borderRadius: 5,
        }}>
            {CHARACTER_OPTIONS.map((charOption, index) => (
                <Box
                    key={index}
                    sx={{
                        position: 'relative',
                        width: 50,
                        height: 50,
                        '&:hover::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundColor: `${charOption.color}55`,
                            transition: 'opacity 0.3s ease-in-out',
                            zIndex: 1,
                        },
                    }}
                >
                    <Box
                        component="img"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: 2,
                        }}
                        src={charOption.src}
                        alt={charOption.alt}
                        onClick={() => handleCharacterSelect(index)}
                    />
                </Box>
            ))}
        </Box>
    );

    const selectedCharacter = CHARACTER_OPTIONS[character] || CHARACTER_OPTIONS[0];

    // モバイル表示用
    if (isMobile) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                overflow: 'hidden',
                mt: 2,
                px: 2
            }}>
                <Box
                    sx={{
                        position: 'relative',
                        width: '50px',
                        height: '50px',
                        marginBottom: 1,
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
                            ...(shouldPulse && isResponseDisplayed && {
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%': { opacity: 0 },
                                    '50%': { opacity: 1 },
                                    '100%': { opacity: 0 },
                                },
                            }),
                        },
                        '&:hover::before': {
                            opacity: isResponseDisplayed || isLoading ? 0 : 1,
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
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            zIndex: 2,
                            opacity: isLoading ? 0.5 : 1,
                        }}
                        onClick={handleOpen}
                        alt={selectedCharacter.alt}
                        src={selectedCharacter.src}
                    />
                </Box>
                <Typography variant="body1" sx={{
                    textAlign: 'center',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    fontSize: '1.1rem',
                    fontFamily: '"Zen Maru Gothic"',
                }}>
                    「{text}」
                </Typography>
                
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    {renderCharacterSelector()}
                </Modal>
            </Box>
        );
    }

    // デスクトップ表示用
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            overflow: 'hidden',
            mt: 2
        }}>
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
                        ...(shouldPulse && isResponseDisplayed && {
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                                '0%': { opacity: 0 },
                                '50%': { opacity: 1 },
                                '100%': { opacity: 0 },
                            },
                        }),
                    },
                    '&:hover::before': {
                        opacity: isResponseDisplayed || isLoading ? 0 : 1,
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
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        zIndex: 2,
                        opacity: isLoading ? 0.5 : 1,
                    }}
                    onClick={handleOpen}
                    alt={selectedCharacter.alt}
                    src={selectedCharacter.src}
                />
            </Box>
            <Typography
                variant="h5"
                component="div"
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    fontFamily: '"Zen Maru Gothic"',
                }}
            >
                「{text}」
            </Typography>
            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="character-selector"
            >
                {renderCharacterSelector()}
            </Modal>
        </Box>
    );
};

export default GrandmaText;
