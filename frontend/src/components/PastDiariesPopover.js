import React, { useState } from 'react';
import { Button, Popover, List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';

const PastDiariesPopover = ({ pastDiaries, onDiarySelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ mb: 2 }}>
            <Button onClick={handleClick} variant="outlined">過去の日記</Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <List sx={{ maxWidth: 300, maxHeight: 300, overflow: 'auto' }}>
                    {pastDiaries.length > 0 ? (
                        pastDiaries.map((diary) => (
                            <ListItem key={diary.id} disablePadding>
                                <ListItemButton onClick={() => {
                                    onDiarySelect(diary.id, diary.action);
                                    handleClose();
                                }}>
                                    <ListItemText primary={diary.action} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="過去の日記はありません" />
                        </ListItem>
                    )}
                </List>
            </Popover>
        </Box>
    );
};

export default PastDiariesPopover;
