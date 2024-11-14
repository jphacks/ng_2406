import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../images/logo.png';
import otnImage from '../images/otn-logo.png';
import oniImage from '../images/oni-logo.png';
import wnkImage from '../images/wnk-logo.png';
const logoOptions = [
    { src: logoImage, alt: '安心打診おばあ' },
    { src: otnImage, alt: '安心打診おとん' },
    { src: oniImage, alt: '安心打診おにぃ' },
    { src: wnkImage, alt: '安心打診わんこ' },
];
const Header = ({ setCharacter, character, handleCalendarSubmit }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const handleLogoClick = () => {
        if (location.pathname !== '/' || location.search !== '') {
            navigate('/', { replace: true });
        }
        setCharacter(0);
        window.location.reload();
    };

    return (
        <AppBar position="fixed" color="default" elevation={2} sx={{ width: '100%' }}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" >
                    <Typography variant="h6" component="div">
                        <img alt={logoOptions[character].alt}
                            src={logoOptions[character].src} style={{
                                height: '40px',
                                marginRight: '10px',
                                cursor: 'pointer'
                            }} onClick={handleLogoClick} />
                    </Typography>
                    {/* カレンダーから予定を取得ボタンをコメントアウト
                    <Button onClick={handleCalendarSubmit} >
                        カレンダーから予定を取得
                    </Button>
                    */}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
