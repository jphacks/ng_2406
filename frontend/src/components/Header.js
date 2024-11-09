import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../images/logo.png';

const Header = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogoClick = () => {
        if (location.pathname !== '/' || location.search !== '') {
            navigate('/', { replace: true });
        }
        window.location.reload();
    };

    return (
        <AppBar position="fixed" color="default" elevation={2} sx={{ width: '100%' }}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" >
                    <Typography variant="h6" component="div">
                        <img src={logoImage} alt="安心問診おばあ" style={{
                            height: '40px',
                            marginRight: '10px',
                            cursor: 'pointer'
                        }} onClick={handleLogoClick} />
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
