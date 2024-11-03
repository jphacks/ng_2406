import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box
} from '@mui/material';
import PastDiariesPopover from './PastDiariesPopover';
import titleImage from '../images/title.png';

const Header = ({ pastDiaries, onDiarySelect }) => {
    return (
        <AppBar position="fixed" color="default" elevation={2} sx={{ width: '100%' }}>
            <Toolbar>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="h6" component="div">
                        <img src={titleImage} alt="安心問診おばあ" style={{ height: '40px' }} />
                    </Typography>
                    <PastDiariesPopover pastDiaries={pastDiaries} onDiarySelect={onDiarySelect} />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
