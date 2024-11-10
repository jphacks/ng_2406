import React from 'react';
import { Box, Paper, Avatar, Typography } from '@mui/material';
import grandmaImage from '../images/grandma.png';
import otnImage from '../images/otn.png';
import oneImage from '../images/one.png';
import wnkImage from '../images/wnk.png';

const fontOptions = [
    "yuji-mai-regular", "reggae-one-regular", "hachi-maru-pop-regular", "zen-antique-regular"
];

const imageOptions = [
    grandmaImage, otnImage, oneImage, wnkImage
];

const ResponseList = ({ aiResponses, character }) => {
    if (!aiResponses || aiResponses.length === 0) {
        return {"face":1,
            "title": "あいうえお",
            "description": "あいうえお"
        };
    }

    const selectedFont = fontOptions[character];
    const selectedImage = imageOptions[character];

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
                            src={selectedImage}
                            alt="キャラクター"
                        >
                            キャラ
                        </Avatar>
                        <Box>
                            <Typography className={selectedFont} variant="h6">{response.title}</Typography>
                            <Typography className={selectedFont} variant="body1">{response.description}</Typography>
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default ResponseList;
