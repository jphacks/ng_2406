import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import handoutImage from '../images/handout.png';
import { CHARACTER_OPTIONS } from '../constants/theme';

const Header = ({ character, onCharacterChange }) => {
    const [openHandout, setOpenHandout] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = '/ng_2406';

    const handleLogoClick = () => {
        if (location.pathname !== `${basePath}/` || location.search !== '') {
            navigate(`${basePath}/`, { replace: true });
        }
        onCharacterChange(0);
        window.location.reload();
    };

    const handleHandout = () => {
        setOpenHandout(true);
    };

    const handleCloseHandout = () => {
        setOpenHandout(false);
    };

    const selectedCharacter = CHARACTER_OPTIONS[character] || CHARACTER_OPTIONS[0];

    return (
        <>
            <AppBar position="fixed" color="default" elevation={2} sx={{ width: '100%' }}>
                <Toolbar>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography variant="h6" component="div">
                            <img
                                alt={selectedCharacter.alt}
                                src={selectedCharacter.logoSrc}
                                style={{
                                    height: '40px',
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                }}
                                onClick={handleLogoClick}
                            />
                        </Typography>
                        <Button onClick={handleHandout}>
                            つかいかた
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Dialog open={openHandout} onClose={handleCloseHandout} maxWidth="md" fullWidth>
                <DialogContent>
                    <img src={handoutImage} alt="使い方" style={{ width: '100%', height: 'auto' }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHandout}>閉じる</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Header;
