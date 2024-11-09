import React, { useState, useCallback, useEffect } from 'react';
import { Container, Box, Button } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
  const [grandmaState, setGrandmaState] = useState('initial');
  const [diaryId, setDiaryId] = useState(null);
  const [diaryUrl, setDiaryUrl] = useState(null);
  const [isLoadingAdditionalInfo, setIsLoadingAdditionalInfo] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const diaryParam = urlParams.get('diary');
    if (diaryParam) {
      fetchDiary(diaryParam);
    }
  }, []);
  const fetchDiary = async (diaryUrl) => {
    setIsLoading(true);
    setGrandmaState('loading');
    try {
      const response = await fetch(`/api/get/diary/${diaryUrl}`);
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

  const handleAction = useCallback(async (actionType, token = null) => {
    setGrandmaState('loading');
    setIsLoading(true);
    setActions([]);
    setFeedbacks([]);
    setIsSubmitted(true);

    try {
      const endpoint = actionType === 'calendar' ? '/api/extract-actions-from-calendar' : '/api/extract-actions';
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      const body = actionType === 'calendar'
        ? JSON.stringify({ date: new Date().toISOString() })
        : JSON.stringify({ schedule: query });

      const extractResponse = await fetch(endpoint, {
        method: 'POST',
        headers,
        body
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, schedule: query, character: 1, diary_id: extractData.diary_id })
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
  }, [query]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    handleAction('query');
  }, [handleAction]);

  const handleCalendarSubmit = useCallback(() => {
    if (!accessToken) {
      console.error('Google認証が必要です');
      return;
    }
    handleAction('calendar', accessToken);
  }, [accessToken, handleAction]);

  const handleLoginSuccess = (res) => {
    setAccessToken(res.accessToken);
  };

  const handleLoginFailure = (res) => {
    console.log('ログインに失敗しました:', res);
  };
  
  return (
    <GoogleOAuthProvider clientId="504058961170-r44epg9gnhdbv2b7elr9f8eu1umhajff.apps.googleusercontent.com">
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
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
                <ResponseList
                  actions={actions}
                  feedbacks={feedbacks}
                  diaryUrl={diaryUrl}
                  isLoadingAdditionalInfo={isLoadingAdditionalInfo}
                />
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
}

export default App;
