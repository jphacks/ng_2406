// src/components/PastDiariesPopover.js
import React, { useState } from 'react';
import { Button, Popover, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const PastDiariesPopover = ({ pastDiaries, onDiarySelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button onClick={handleClick}>過去の日記</Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <List>
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
        </>
    );
};

export default PastDiariesPopover;
