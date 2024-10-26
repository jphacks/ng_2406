import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Paper
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import './App.css';
import titleImage from './images/title.png';
import grandmaImage from './images/grandma.png';

function GrandmaForm() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponses, setAiResponses] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  return (
    <Container maxWidth="sm">
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isSubmitted ? 'flex-start' : 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease-in-out',
        pt: isSubmitted ? 4 : 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center',  }}>
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
                      response.face === 1 ? 'green' :
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
