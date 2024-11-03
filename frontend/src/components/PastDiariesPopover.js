import React, { useState } from 'react';
import { Button, Popover, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

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
        <>
            <Button onClick={handleClick} color="inherit" variant='outlined'>
                過去の相談
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <List sx={{ maxWidth: '300px' }}>
                    {pastDiaries.length > 0 ? (
                        pastDiaries.map((diary) => (
                            <ListItem key={diary.id} sx={{ width: 'auto' }} >
                                <ListItemButton onClick={() => {
                                    onDiarySelect(diary.id, diary.action);
                                    handleClose();
                                }}>
                                    <ListItemText
                                        primary={`${new Date(diary.date).toLocaleString('ja-JP')}`}
                                        secondary={diary.action}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem sx={{ width: 'auto' }} >
                            <ListItemText primary="過去の相談はありません" />
                        </ListItem>
                    )}
                </List>
            </Popover>
        </>
    );
};

export default PastDiariesPopover;
