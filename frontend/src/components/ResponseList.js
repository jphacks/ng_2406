import React from 'react';
import { Box, Paper, Avatar, Typography } from '@mui/material';
import grandmaImage from '../images/grandma.png';

const ResponseList = ({ aiResponses }) => {
    if (!aiResponses || aiResponses.length === 0) {
        return null;
    }

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            {aiResponses.map((response, index) => (
                <Paper key={index} elevation={3} sx={{ p: 2, mt: 2, width: '100%', bgcolor: '#e9e9e9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar
                            sx={{
                                bgcolor: response.face === 0 ? 'blue' :
                                    response.face === 1 ? 'orange' :
                                        response.face === 2 ? 'red' :
                                            response.face === 3 ? "black" : 'blue',
                                mr: 2,
                                width: 56,
                                height: 56
                            }}
                            src={grandmaImage}
                            alt="おばあちゃん"
                        >
                            おばあ
                        </Avatar>
                        <Box>
                            <Typography className="yuji-mai-regular" variant="h6">{response.title}</Typography>
                            <Typography className="yuji-mai-regular" variant="body1">{response.description}</Typography>
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default ResponseList;
