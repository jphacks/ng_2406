import React, { useState, useCallback, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import './App.css';
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import GrandmaText from './components/GrandmaText';
import LoadingIndicator from './components/LoadingIndicator';
import ResponseList from './components/ResponseList';
import Footer from './components/Footer';
import dialogs from './data/dialogs.json';

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [character, setCharacter] = useState(() => {
    const savedCharacter = localStorage.getItem('character');
    return savedCharacter !== null ? parseInt(savedCharacter, 10) : 0;
  });
  const [hasChangedCharacter, setHasChangedCharacter] = useState(() => {
    return localStorage.getItem('hasChangedCharacter') === 'true';
  });
  const [grandmaState, setGrandmaState] = useState('initial');
  const [diaryId, setDiaryId] = useState(null);
  const [diaryUrl, setDiaryUrl] = useState(null);
  const [isLoadingAdditionalInfo, setIsLoadingAdditionalInfo] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(true);
  const [lastCharacter, setLastCharacter] = useState(0);
  const [shouldPulse, setShouldPulse] = useState(!hasChangedCharacter);
  const [isResponseDisplayed, setIsResponseDisplayed] = useState(false);
  const [sortedFeedbacks, setSortedFeedbacks] = useState([]);
  const [isCalendarDataFetched, setIsCalendarDataFetched] = useState(false);


  const backgroundColors = [
    '#F5F5F5', // おばあ
    '#E6F3FF', // おとん
    '#F0FFE6', // おにぃ（おねえ）
    '#FFE6E6'  // わんこ
  ];

  const handleCharacterChange = (index) => {
    if (!hasChangedCharacter) {
      setIsResponseDisplayed(false);
      setHasChangedCharacter(true);
      localStorage.setItem('hasChangedCharacter', 'true');
    }
    if (index !== character) {
      setLastCharacter(character);
      setCharacter(index);
      setIsDialogVisible(false);
      setGrandmaState('initial');
    } else {
      setIsDialogVisible(true);
    }
  };

  useEffect(() => {
    if (character === lastCharacter) {
      setIsDialogVisible(true);
    }
  }, [character, lastCharacter]);

  useEffect(() => {
    localStorage.setItem('character', character);
  }, [character]);

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
    setFeedbacks([]);
    setSortedFeedbacks([]);
    setIsSubmitted(true);
    setGrandmaState('loading');
    try {
      const response = await fetch(`/api/get/diary/${diaryUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCharacter(data.character);
      setQuery(data.schedule);

      // アクションとフィードバックを適切に設定
      const actionsWithFeedback = data.actions.map(action => ({
        action: action.action,
        feedback: action.feedback,
        face: action.face,
        idx: action.idx
      }));

      setActions(actionsWithFeedback.map(item => item.action));

      // フィードバックをソートして設定
      const sortedFeedbacks = actionsWithFeedback.sort((a, b) => a.idx - b.idx);
      setFeedbacks(sortedFeedbacks);
      setSortedFeedbacks(sortedFeedbacks);

      setDiaryUrl(diaryUrl);
      setDiaryId(diaryUrl);
      setIsSubmitted(true);
      setGrandmaState('waiting');
    } catch (error) {
      console.error('Error fetching diary:', error);
      setGrandmaState('error');
    } finally {
      setGrandmaState("pastResponse");
      setIsLoading(false);
      setIsResponseDisplayed(true);
    }
  };
  const handleAction = useCallback(async (actionType, token = null) => {
    setGrandmaState('loading');
    setIsLoading(true);
    setActions([]);
    setFeedbacks([]);
    setSortedFeedbacks([]);
    setIsSubmitted(true);
    try {
      let extractData;
      if (actionType === 'calendar') {
        const response = await fetch('/api/get/calendar_events', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          setIsLoading(false);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        extractData = await response.json();
      } else {
        const extractResponse = await fetch('/api/extract-actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ schedule: query, character }),
        });
        if (!extractResponse.ok) {
          setIsLoading(false);
          throw new Error(`HTTP error! status: ${extractResponse.status}`);
        }
        extractData = await extractResponse.json();
      }

      setActions(extractData.actions);
      setDiaryId(extractData.diary_id);
      setDiaryUrl(extractData.diary_url);
      setGrandmaState('waiting');
      setIsDialogVisible(true);
      setIsLoading(false);

      const feedbackPromises = extractData.actions.map((action, idx) =>
        fetch('/api/action-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action,
            schedule: query,
            character,
            diary_id: extractData.diary_id,
            idx: idx
          })
        }).then(res => res.json())
      );

      const feedbackResults = await Promise.all(feedbackPromises);
      const sortedResults = feedbackResults.sort((a, b) => a.idx - b.idx);
      setFeedbacks(sortedResults);
      setSortedFeedbacks(sortedResults);
    } catch (error) {
      console.error('Error:', error);
      setGrandmaState('error');
    } finally {
      setIsResponseDisplayed(true);
      setIsLoadingAdditionalInfo(false);
    }
  }, [query, character]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    handleAction('query');
  }, [handleAction]);


  const fetchCalendarEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get/calendar_events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActions(data.events.map(event => event.action));
      setDiaryId(data.events[0].event_id); // 最初のイベントIDを使用
    } catch (error) {
      console.error('カレンダーイベントの取得に失敗しました:', error);
      setGrandmaState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getCalendarEventFeedback = async (action) => {
    try {
      const response = await fetch('/api/calendar-event-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, character }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('フィードバックの取得に失敗しました:', error);
      return null;
    }
  };

  const handleCalendarSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get/calendar_events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('取得したカレンダーデータ:', data); // デバッグ用

      setActions(data.events.map(event => event.action));
      setDiaryId(data.events[0].event_id);
      setIsCalendarDataFetched(true);

      const feedbackPromises = data.events.map(event => getCalendarEventFeedback(event.action));
      const feedbackResults = await Promise.all(feedbackPromises);
      console.log('取得したフィードバック:', feedbackResults); // デバッグ用

      setFeedbacks(feedbackResults);
      setSortedFeedbacks(feedbackResults);
    } catch (error) {
      console.error('カレンダーイベントの取得に失敗しました:', error);
      setGrandmaState('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddToCalendar = useCallback(async () => {
    setIsLoading(true);
    try {
      const eventsWithFeedback = sortedFeedbacks.map((feedback, index) => ({
        event_id: actions[index].event_id,
        feedback: feedback.feedback
      }));

      const response = await fetch('/api/add-feedback-to-calendar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsWithFeedback }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message);
      // ここで成功メッセージを表示するなどの処理を追加できます
    } catch (error) {
      console.error('カレンダーへのフィードバック追加に失敗しました:', error);
      // ここでエラーメッセージを表示するなどの処理を追加できます
    } finally {
      setIsLoading(false);
    }
  }, [actions, sortedFeedbacks]);
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: backgroundColors[character],
      transition: 'background-color 0.3s ease-in-out'
    }}>
      <Header
        setCharacter={setCharacter}
        character={character}
        handleCalendarSubmit={handleCalendarSubmit}
        handleAddToCalendar={handleAddToCalendar}
        isCalendarDataFetched={isCalendarDataFetched}
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
              text={dialogs[character][grandmaState]}
              onCharacterChange={handleCharacterChange}
              isResponseDisplayed={isResponseDisplayed}
              character={character}
              isLoading={isLoading}
              shouldPulse={shouldPulse}
            />
            <QueryInput
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
              character={character}
            />
            {isLoading && <LoadingIndicator />}
            {isSubmitted && !isLoading && actions.length > 0 && isDialogVisible && (
              <ResponseList
                actions={actions}
                feedbacks={sortedFeedbacks}
                diaryUrl={diaryUrl}
                isLoadingAdditionalInfo={isLoadingAdditionalInfo}
                character={character}
              />
            )}
          </Box>
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}

export default App;
