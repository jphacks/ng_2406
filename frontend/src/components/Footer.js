import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import gooImage from '../images/sgoo.png';
import githubImage from '../images/github-mark.png';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                width: '100%',
                padding: '20px 0',
                textAlign: 'center',
                marginTop: 'auto',
            }}
        >
            <Typography variant="caption" color="text.secondary">
                © 2024 安心打診おばあ. All rights reserved.
            </Typography>

            <Box sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
            }}>
                <Link href="http://www.goo.ne.jp/" target="_blank" rel="noopener noreferrer">
                    <Box
                        component="img"
                        src={gooImage}
                        alt="supported by goo"
                        title="supported by goo"
                        sx={{ width: '100px', height: 'auto' }}
                    />
                </Link>
                <Link href="https://github.com/jphacks/ng_2406" target="_blank" rel="noopener noreferrer">
                    <Box
                        component="img"
                        src={githubImage}
                        alt="GitHub Repository"
                        title="View on GitHub"
                        sx={{ width: '32px', height: 'auto' }}
                    />
                </Link>
            </Box>
            <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    Icons by
                    <Link href="https://icons8.jp/" color="inherit" sx={{ mx: 1 }}>
                        Icons8
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;
