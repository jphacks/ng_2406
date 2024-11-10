import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box
} from '@mui/material';
import PastDiariesPopover from './PastDiariesPopover';
import logoImage from '../images/logo.png';
import otnImage from '../images/otn-logo.png';
import oneImage from '../images/one-logo.png';
import wnkImage from '../images/wnk-logo.png';


const logoOptions = [
    { src: logoImage, alt: '安心打診おばあ' },
    { src: otnImage, alt: '安心打診おとん' },
    { src: oneImage, alt: '安心打診おねぇ' },
    { src: wnkImage, alt: '安心打診わんこ' },
];


const Header = ({ pastDiaries, onDiarySelect, character }) => {
    const handleLogoClick = () => {
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
                    <PastDiariesPopover pastDiaries={pastDiaries} onDiarySelect={onDiarySelect} />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
