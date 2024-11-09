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
  const [pastDiaries, setPastDiaries] = useState([]);
  const [grandmaState, setGrandmaState] = useState('initial');
  const [diaryId, setDiaryId] = useState(null);
  const [diaryUrl, setDiaryUrl] = useState(null);

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
    setGrandmaState('loading');
    setIsLoading(true);
    setActions([]);
    setFeedbacks([]);
    setIsSubmitted(true);

    try {
      // 行動を抽出
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

      // 天気に関するフィードバックを取得
      const weatherResponse = await fetch('/api/weather-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule: query, character: 1, diary_id: extractData.diary_id })
      });

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        if (weatherData.is_used) {
          setFeedbacks(prevFeedbacks => [...prevFeedbacks, weatherData]);
        }
      }

      // 各行動に対してフィードバックを取得
      const feedbackPromises = extractData.actions.map(action =>
        fetch('/api/action-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: action, schedule: query, character: 1, diary_id: extractData.diary_id })
        }).then(res => res.json())
      );

      const feedbackResults = await Promise.all(feedbackPromises);
      setFeedbacks(prevFeedbacks => [...prevFeedbacks, ...feedbackResults]);

    } catch (error) {
      console.error('Error:', error);
      setGrandmaState('error');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handlePastDiary = useCallback(async (diaryUrl) => {
    setGrandmaState('loading');
    setIsLoading(true);
    setActions([]);
    setFeedbacks([]);
    setIsSubmitted(true);

    try {
      const response = await fetch(`/api/get/diary/${diaryUrl}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQuery(data.schedule);
      setActions(data.actions.map(action => action.action));
      setFeedbacks(data.actions);
      setGrandmaState('pastResponse');
    } catch (error) {
      console.error('Error:', error);
      setGrandmaState('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDiarySelect = (diaryUrl, schedule) => {
    setQuery(schedule);
    handlePastDiary(diaryUrl);
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
            <GrandmaText text={dialogs.grandma[grandmaState]} />
            <QueryInput
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            {isLoading && <LoadingIndicator />}
            {isSubmitted && !isLoading && actions.length > 0 && (
              <ResponseList actions={actions} feedbacks={feedbacks} diaryUrl={diaryUrl} />
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
