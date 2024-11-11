import React, { useState, useCallback, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import './App.css';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import GrandmaText from './components/GrandmaText';
import LoadingIndicator from './components/LoadingIndicator';
import ResponseList from './components/ResponseList';
import dialogs from './data/dialogs.json';

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [character, setCharacter] = useState(0);
  const [grandmaState, setGrandmaState] = useState('initial');
  const [diaryId, setDiaryId] = useState(null);
  const [diaryUrl, setDiaryUrl] = useState(null);
  const [isLoadingAdditionalInfo, setIsLoadingAdditionalInfo] = useState(false);

  const backgroundColors = [
    '#F5F5F5', // おばあ
    '#E6F3FF', // おとん
    '#F0FFE6', // おねえ
    '#FFE6E6'  // わんこ
  ];

  const handleCharacterChange = (index) => {
    setCharacter(index);
    console.log(`選択されたキャラクター: ${index}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const diaryParam = urlParams.get('diary');
    if (diaryParam) {
      fetchDiary(diaryParam);
    }
  }, []);

  const fetchDiary = async (diaryUrl) => {
    setIsLoading(true);
    setActions([]);
    setIsSubmitted(true);
    const requestBody = { action: query, character };
    console.log('サーバーに送信するデータ:', requestBody);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuery(data.schedule);
      setActions(data.actions.map(action => action.action));
      setFeedbacks(data.actions);
      setDiaryUrl(diaryUrl);
      setIsSubmitted(true);
      setGrandmaState('waiting');
    } catch (error) {
      console.error('Error fetching diary:', error);
      setGrandmaState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setGrandmaState('loading');
    setIsLoading(true);
    setActions([]);
    setFeedbacks([]);
    setIsSubmitted(true);

    try {
      const extractResponse = await fetch('/api/extract-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule: query })
      });

      if (!extractResponse.ok) {
        throw new Error(`HTTP error! status: ${extractResponse.status}`);
      }

      const extractData = await extractResponse.json();
      setActions(extractData.actions);
      setDiaryId(extractData.diary_id);
      setDiaryUrl(extractData.diary_url);
      setGrandmaState('waiting');
      setIsLoading(false);

      const feedbackPromises = extractData.actions.map(action =>
        fetch('/api/action-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action, schedule: query, character, diary_id: extractData.diary_id })
        }).then(res => res.json())
      );

      const feedbackResults = await Promise.all(feedbackPromises);
      setFeedbacks(prevFeedbacks => [...prevFeedbacks, ...feedbackResults]);

    } catch (error) {
      console.error('Error:', error);
      setGrandmaState('error');
    } finally {
      setIsLoadingAdditionalInfo(false);
    }
  }, [query, character]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: backgroundColors[character],
      transition: 'background-color 0.3s ease-in-out'
    }}>
      <Header
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
            <GrandmaText text={dialogs.grandma[grandmaState]} onCharacterChange={handleCharacterChange}
              character={character} />
            <QueryInput
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
              character={character}
            />
            {isLoading && <LoadingIndicator />}
            {isSubmitted && !isLoading && actions.length > 0 && (
              <ResponseList
                actions={actions}
                feedbacks={feedbacks}
                diaryUrl={diaryUrl}
                isLoadingAdditionalInfo={isLoadingAdditionalInfo}
                character={character}
              />
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
