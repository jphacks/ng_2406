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
import logoImage from '../images/logo.png';
import otnImage from '../images/otn-logo.png';
import oniImage from '../images/oni-logo.png';
import wnkImage from '../images/wnk-logo.png';
import handoutImage from '../images/handout.png';

const logoOptions = [
    { src: logoImage, alt: '安心打診おばあ' },
    { src: otnImage, alt: '安心打診おとん' },
    { src: oniImage, alt: '安心打診おにぃ' },
    { src: wnkImage, alt: '安心打診わんこ' },
];

const Header = ({ setCharacter, character, handleCalendarSubmit }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openHandout, setOpenHandout] = useState(false);

    const handleLogoClick = () => {
        if (location.pathname !== '/' || location.search !== '') {
            navigate('/', { replace: true });
        }
        setCharacter(0);
        window.location.reload();
    };

    const handleHandout = () => {
        setOpenHandout(true);
    };

    const handleCloseHandout = () => {
        setOpenHandout(false);
    };

    return (
        <>
            <AppBar position="fixed" color="default" elevation={2} sx={{ width: '100%' }}>
                <Toolbar>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography variant="h6" component="div">
                            <img alt={logoOptions[character].alt}
                                src={logoOptions[character].src} style={{
                                    height: '40px',
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                }} onClick={handleLogoClick} />
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
