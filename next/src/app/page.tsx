"use client";

import { useCallback, useEffect, Suspense } from "react";
import { Container, Box } from "@mui/material";
import { useSearchParams } from "next/navigation";

import Header from "@/components/Header";
import QueryInput from "@/components/QueryInput";
import GrandmaText from "@/components/GrandmaText";
import LoadingIndicator from "@/components/LoadingIndicator";
import ResponseList from "@/components/ResponseList";
import Footer from "@/components/Footer";

import useApi from "@/hooks/useApi";
import useCharacter from "@/hooks/useCharacter";
import useAppState from "@/hooks/useAppState";
import dialogs from "@/data/dialogs.json";

import { BACKGROUND_COLORS } from "@/constants/theme";

type DialogMap = Record<string, Record<string, string>>;
const dialogData = dialogs as DialogMap;

function AppContent() {
  const { isLoading, fetchDiary, analyzeSchedule } = useApi();
  const { character, setCharacter, handleCharacterChange, hasChangedCharacter } =
    useCharacter();
  const {
    query,
    setQuery,
    actions,
    setActions,
    sortedFeedbacks,
    setSortedFeedbacks,
    isSubmitted,
    diaryUrl,
    setDiaryUrl,
    grandmaState,
    setGrandmaState,
    isDialogVisible,
    setIsDialogVisible,
    isResponseDisplayed,
    setIsResponseDisplayed,
    startLoading,
    finishLoading,
  } = useAppState();

  const searchParams = useSearchParams();
  const shouldPulse = !hasChangedCharacter;

  const onCharacterChange = useCallback(
    (index: number) => {
      const changed = handleCharacterChange(index);
      if (!hasChangedCharacter) {
        setIsResponseDisplayed(false);
      }
      if (changed) {
        setIsDialogVisible(false);
        setGrandmaState("initial");
      } else {
        setIsDialogVisible(true);
      }
    },
    [
      handleCharacterChange,
      hasChangedCharacter,
      setIsResponseDisplayed,
      setIsDialogVisible,
      setGrandmaState,
    ]
  );

  const handleFetchDiary = useCallback(
    async (url: string) => {
      startLoading();
      await fetchDiary(url, {
        onSuccess: (data) => {
          setCharacter(data.character);
          setQuery(data.schedule);

          const actionsWithFeedback = data.actions.map((action) => ({
            action: action.action,
            feedback: action.feedback,
            face: action.face,
            idx: action.idx,
          }));

          setActions(actionsWithFeedback.map((item) => item.action));
          const sorted = [...actionsWithFeedback].sort((a, b) => a.idx - b.idx);
          setSortedFeedbacks(sorted);

          setDiaryUrl(url);
          setGrandmaState("pastResponse");
          setIsResponseDisplayed(true);
        },
        onError: () => {
          setGrandmaState("error");
        },
      });
    },
    [
      fetchDiary,
      setCharacter,
      setQuery,
      setActions,
      setSortedFeedbacks,
      setDiaryUrl,
      setGrandmaState,
      startLoading,
      setIsResponseDisplayed,
    ]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent | React.KeyboardEvent) => {
      event.preventDefault();
      startLoading();

      const data = await analyzeSchedule(query, character, {
        onError: () => {
          setGrandmaState("error");
        },
      });

      if (data) {
        setActions(data.feedbacks.map((f) => f.action));
        setDiaryUrl(data.diary_url);
        setSortedFeedbacks(data.feedbacks);
        finishLoading(true);
      } else {
        finishLoading(false);
      }
    },
    [
      query,
      character,
      analyzeSchedule,
      setActions,
      setDiaryUrl,
      setGrandmaState,
      setSortedFeedbacks,
      startLoading,
      finishLoading,
    ]
  );

  useEffect(() => {
    const diaryParam = searchParams.get("diary");
    if (diaryParam) {
      handleFetchDiary(diaryParam);
    }
  }, [searchParams, handleFetchDiary]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: BACKGROUND_COLORS[character],
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <Header character={character} onCharacterChange={onCharacterChange} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          pt: "64px",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "calc(100vh - 64px)",
              justifyContent: isSubmitted ? "flex-start" : "center",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <GrandmaText
              text={dialogData[character]?.[grandmaState] ?? ""}
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

            {isSubmitted &&
              !isLoading &&
              actions.length > 0 &&
              isDialogVisible &&
              isResponseDisplayed && (
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

export default function Home() {
  return (
    <Suspense>
      <AppContent />
    </Suspense>
  );
}
