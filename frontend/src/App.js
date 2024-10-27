import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Paper,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import './App.css';
import titleImage from './images/title.png';
import grandmaImage from './images/grandma.png';

function GrandmaForm() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponses, setAiResponses] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const pastConsultations = ['相談1', '相談2', '相談3', '相談4'];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setAiResponses([]);
    setIsSubmitted(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: query })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message) {
        console.error('サーバーエラー:', data.message);
      } else {
        setAiResponses(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleKeyDown = useCallback((event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSubmit(event);
    }
  }, [handleSubmit]);

  const handleSearchPast = () => {
    // ヘルプボタンがクリックされたときの処理をここに書きます
    console.log('ヘルプボタンがクリックされました');
  };
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button
          variant='outlined'
          onClick={handleClick}
          sx={{ bgcolor: 'background.paper' }}
        >
          過去の相談
        </Button>
        <Popover
          id={id}
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
          <List>
            {pastConsultations.map((consultation, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => {
                  console.log(`${consultation}が選択されました`);
                  setQuery(consultation);
                  handleClose();
                  handleSubmit({ preventDefault: () => { } });
                }}>
                  <ListItemText primary={consultation} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Popover>
      </Box>
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isSubmitted ? 'flex-start' : 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease-in-out',
        pt: isSubmitted ? 4 : 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', }}>
          <Box
            component="img"
            sx={{
              height: 'auto',
              width: '50px',  // タイトルの文字サイズに合わせて調整
              maxWidth: '100%',
              objectFit: 'contain'
            }}
            alt="タイトルおばあ"
            src={titleImage}
          />
          <Typography className="zen-maru-gothic-regular" variant="h4" component="h1">
            「今日の予定を教えておくれ」
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="query"
            multiline
            rows={3}
            label="今日は朝卵を食べて、塩釜口に行って..."
            name="query"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="zen-maru-gothic-regular"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
            className="zen-maru-gothic-regular"
          >
            {isLoading ? 'おばあを呼んでいます...' : 'おばあを呼ぶ'}
          </Button>
        </Box>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ width: '100%', mt: 2 }}>
          {aiResponses.map((response, index) => (
            <Paper key={index} elevation={3} sx={{ p: 2, mt: 2, width: '100%', bgcolor: '#e9e9e9' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar
                  sx={{
                    bgcolor: response.face === 0 ? 'blue' :
                      response.face === 1 ? 'orange ' :
                        response.face === 2 ? 'red' : 'blue',
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
      </Box>
    </Container >
  );
}

export default GrandmaForm;
