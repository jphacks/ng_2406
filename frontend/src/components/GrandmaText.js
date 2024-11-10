import React from 'react';
import { Box, Typography, Modal } from '@mui/material';
import titleImage from '../images/title.png';
import oneImage from '../images/one.png';
import otnImage from '../images/otn.png';
import wnkImage from '../images/wnk.png';


const GrandmaText = ({ isResponseDisplayed, onCharacterChange, character }) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const imageOptions = [
        { src: titleImage, alt: 'おばあ', color: '#FFA500' },
        { src: otnImage, alt: 'おとん', color: '#E6F3FF' },
        { src: oneImage, alt: 'おねぇ', color: '#F0FFE6' },
        { src: wnkImage, alt: 'わんこ', color: '#FFE6E6' },
    ];

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
                    onClick={handleOpen}
                    alt={imageOptions[character].alt}
                    src={imageOptions[character].src}
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
                fontFamily: '"Zen Maru Gothic", sans-serif',
            }}
        >
            「{text}」
        </Typography>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
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
                    {imageOptions.map((image, index) => (
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
                                    backgroundColor: `${image.color}66`,
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
                                src={image.src}
                                alt={image.alt}
                                onClick={() => {
                                    onCharacterChange(index);
                                    handleClose();
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </Modal>
        </Box>
    );
};

export default GrandmaText;
