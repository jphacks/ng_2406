import React, { useState, useCallback, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import './App.css';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import GrandmaText from './components/GrandmaText';
import LoadingIndicator from './components/LoadingIndicator';
import ResponseList from './components/ResponseList';

import logoImage from './images/logo.png';
import otnLogoImage from './images/otn-logo.png';

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponses, setAiResponses] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pastDiaries, setPastDiaries] = useState([]);
  const [character, setCharacter] = useState(0);

  const backgroundColors = [
    '#F5F5F5',// おばあ
    '#E6F3FF',// おとん
    '#F0FFE6',// おねえ
    '#FFE6E6'// わんこ
  ];


  const handleCharacterChange = (index) => {
    setCharacter(index);
    console.log(`選択されたキャラクター: ${index}`);
  };


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
    const requestBody = { action: query, character };
    console.log('サーバーに送信するデータ:', requestBody);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: query, character })
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
  }, [query, character]);

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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: backgroundColors[character],
      transition: 'background-color 0.3s ease-in-out'
    }}>
      <Header
        pastDiaries={pastDiaries}
        onDiarySelect={handleDiarySelect}
        character={character}
      />
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
            <GrandmaText
              isResponseDisplayed={isSubmitted && !isLoading && aiResponses.length > 0}
              onCharacterChange={handleCharacterChange}
              character={character}
            />
            <QueryInput query={query} setQuery={setQuery} onSubmit={handleSubmit} character={character} />
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
