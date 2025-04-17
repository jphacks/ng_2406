import React, { useState, useCallback, useEffect } from 'react';
import { Container, Box, } from '@mui/material';
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
  // 変数名の前に _ をつけると未使用変数の警告を抑制できます
  const [_feedbacks, setFeedbacks] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [character, setCharacter] = useState(() => {
    const savedCharacter = localStorage.getItem('character');
    return savedCharacter !== null ? parseInt(savedCharacter, 10) : 0;
  });
  const [hasChangedCharacter, setHasChangedCharacter] = useState(() => {
    return localStorage.getItem('hasChangedCharacter') === 'true';
  });
  const [grandmaState, setGrandmaState] = useState('initial');
  // 未使用変数は _ をつけて警告を抑制
  const [_diaryId, _setDiaryId] = useState(null);
  const [diaryUrl, setDiaryUrl] = useState(null);
  const [isLoadingAdditionalInfo, setIsLoadingAdditionalInfo] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(true);
  const [lastCharacter, setLastCharacter] = useState(0);
  const [shouldPulse, _setShouldPulse] = useState(!hasChangedCharacter);
  const [isResponseDisplayed, setIsResponseDisplayed] = useState(false);
  const [sortedFeedbacks, setSortedFeedbacks] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

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

  const fetchDiary = useCallback(async (diaryUrl) => {
    setIsLoading(true);
    setActions([]);
    setFeedbacks([]);
    setSortedFeedbacks([]);
    setIsSubmitted(true);
    setGrandmaState('loading');
    try {
      const response = await fetch(`${apiBaseUrl}/api/get/diary/${diaryUrl}`, {
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
  }, [apiBaseUrl]);

  useEffect(() => {
    if (character === lastCharacter) {
      setIsDialogVisible(true);
    }
  }, [character, lastCharacter]);

  useEffect(() => {
    // character値が正しい範囲内かをチェック
    if (character < 0 || character > 3) {
      console.error('キャラクター値が範囲外です:', character);
      return;
    }
    localStorage.setItem('character', character);
  }, [character]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const diaryParam = urlParams.get('diary');
    if (diaryParam) {
      fetchDiary(diaryParam);
    }
  }, [fetchDiary]);

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
        const response = await fetch(`${apiBaseUrl}/api/get/calendar_events`, {
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
        const extractResponse = await fetch(`${apiBaseUrl}/api/extract-actions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ schedule: query, character }),
        });

        // 以下を追加してエラーの詳細を確認
        if (!extractResponse.ok) {
          const errorText = await extractResponse.text();
          console.error(`Error response: ${errorText}`);
          setIsLoading(false);
          throw new Error(`HTTP error! status: ${extractResponse.status}, details: ${errorText}`);
        }

        extractData = await extractResponse.json();
      }

      setActions(extractData.actions);
      setActions(extractData.actions);
      setDiaryUrl(extractData.diary_url);
      setGrandmaState('waiting');
      setIsLoading(false);

      const feedbackPromises = extractData.actions.map((action, idx) =>
        fetch(`${apiBaseUrl}/api/action-feedback`, {
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
  }, [query, character, apiBaseUrl]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    handleAction('query');
  }, [handleAction]);

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
