import React, { useCallback, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import './App.css';

// Components
import Header from './components/Header';
import QueryInput from './components/QueryInput';
import GrandmaText from './components/GrandmaText';
import LoadingIndicator from './components/LoadingIndicator';
import ResponseList from './components/ResponseList';
import Footer from './components/Footer';

// Hooks and Data
import useApi from './hooks/useApi';
import useCharacter from './hooks/useCharacter';
import useAppState from './hooks/useAppState';
import dialogs from './data/dialogs.json';

// Constants
import { BACKGROUND_COLORS } from './constants/theme';

function App() {
  // Custom hooks
  const { isLoading, fetchDiary, extractActions, getActionFeedback } = useApi();
  const { character, setCharacter, handleCharacterChange, hasChangedCharacter } = useCharacter();
  const {
    query, setQuery,
    actions, setActions,
    sortedFeedbacks, setSortedFeedbacks,
    isSubmitted, setIsSubmitted,
    diaryUrl, setDiaryUrl,
    grandmaState, setGrandmaState,
    isDialogVisible, setIsDialogVisible,
    isResponseDisplayed, setIsResponseDisplayed,
    isLoadingAdditionalInfo, setIsLoadingAdditionalInfo,
    resetState, startLoading, finishLoading
  } = useAppState();

  const shouldPulse = !hasChangedCharacter;

  // Handler for character change
  const onCharacterChange = useCallback((index) => {
    const changed = handleCharacterChange(index);
    if (!hasChangedCharacter) {
      setIsResponseDisplayed(false);
    }

    if (changed) {
      setIsDialogVisible(false);
      setGrandmaState('initial');
    } else {
      setIsDialogVisible(true);
    }
  }, [handleCharacterChange, hasChangedCharacter, setIsResponseDisplayed, setIsDialogVisible, setGrandmaState]);

  // Fetch diary by URL parameter
  const handleFetchDiary = useCallback(async (diaryUrl) => {
    startLoading();

    await fetchDiary(diaryUrl, {
      onSuccess: (data) => {
        setCharacter(data.character);
        setQuery(data.schedule);

        const actionsWithFeedback = data.actions.map(action => ({
          action: action.action,
          feedback: action.feedback,
          face: action.face,
          idx: action.idx
        }));

        setActions(actionsWithFeedback.map(item => item.action));
        
        const sortedFeedbacks = actionsWithFeedback.sort((a, b) => a.idx - b.idx);
        setSortedFeedbacks(sortedFeedbacks);

        setDiaryUrl(diaryUrl);
        setGrandmaState('pastResponse');
        setIsResponseDisplayed(true);
      },
      onError: () => {
        setGrandmaState('error');
      }
    });
  }, [
    fetchDiary, setCharacter, setQuery, setActions,
    setSortedFeedbacks, setDiaryUrl, setGrandmaState,
    startLoading, setIsResponseDisplayed
  ]);

  // Submit handler for user query
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    startLoading();

    const extractData = await extractActions(query, character, {
      onError: () => {
        setGrandmaState('error');
      }
    });

    if (extractData) {
      setActions(extractData.actions);
      setDiaryUrl(extractData.diary_url);
      setGrandmaState('waiting');

      const feedbackPromises = extractData.actions.map((action, idx) =>
        getActionFeedback(action, query, character, extractData.diary_id, idx)
      );

      const feedbackResults = await Promise.all(feedbackPromises);
      const sortedResults = feedbackResults.filter(Boolean).sort((a, b) => a.idx - b.idx);
      setSortedFeedbacks(sortedResults);

      finishLoading(true);
    } else {
      finishLoading(false);
    }
  }, [
    query, character, extractActions, getActionFeedback,
    setActions, setDiaryUrl, setGrandmaState, setSortedFeedbacks,
    startLoading, finishLoading
  ]);

  // Check URL params for diary
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const diaryParam = urlParams.get('diary');
    if (diaryParam) {
      handleFetchDiary(diaryParam);
    }
  }, [handleFetchDiary]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: BACKGROUND_COLORS[character],
      transition: 'background-color 0.3s ease-in-out'
    }}>
      <Header character={character} onCharacterChange={onCharacterChange} />

      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        pt: '64px',
        transition: 'all 0.3s ease-in-out',
      }}>
        <Container maxWidth="sm">
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
            justifyContent: isSubmitted ? 'flex-start' : 'center',
            transition: 'all 0.3s ease-in-out',
          }}>
            <GrandmaText
              text={dialogs[character][grandmaState]}
              onCharacterChange={onCharacterChange}
              isResponseDisplayed={isResponseDisplayed}
              character={character}
              isLoading={isLoading}
              shouldPulse={shouldPulse}
            />

            <QueryInput
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              character={character}
            />

            {isLoading && <LoadingIndicator />}

            {isSubmitted && !isLoading && actions.length > 0 &&
              isDialogVisible && isResponseDisplayed && (
                <ResponseList
                  actions={actions}
                  feedbacks={sortedFeedbacks}
                  diaryUrl={diaryUrl}
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
