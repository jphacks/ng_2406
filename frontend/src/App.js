import React, { useState, useCallback, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import './App.css';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import GrandmaText from './components/GrandmaText';
import LoadingIndicator from './components/LoadingIndicator';
import ResponseList from './components/ResponseList';

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponses, setAiResponses] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pastDiaries, setPastDiaries] = useState([]);


  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await fetch('/api/get_diaries');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPastDiaries(data.diaries);
        console.log('取得した日記:', data);
      } catch (error) {
        console.error('日記の取得に失敗しました:', error);
        setPastDiaries([]);
      }
    };
    fetchDiaries();
  }, []);

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

  const handlePastId = useCallback(async (diaryId) => {
    setIsLoading(true);
    setAiResponses([]);
    setIsSubmitted(true);

    try {
      const response = await fetch('/api/get_feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diary_id: diaryId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message) {
        console.error('サーバーエラー:', data.message);
      } else {
        setQuery(data.action);
        setAiResponses(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDiarySelect = (id, action) => {
    setQuery(action);
    handlePastId(id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header pastDiaries={pastDiaries} onDiarySelect={handleDiarySelect} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: '64px',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 'calc(100vh - 64px)',
              justifyContent: isSubmitted ? 'flex-start' : 'center',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <GrandmaText isResponseDisplayed={isSubmitted && !isLoading && aiResponses.length > 0} />
            <QueryInput query={query} setQuery={setQuery} onSubmit={handleSubmit} />
            {isLoading && <LoadingIndicator />}
            {isSubmitted && !isLoading && aiResponses && aiResponses.length > 0 && (
              <ResponseList aiResponses={aiResponses} />
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
