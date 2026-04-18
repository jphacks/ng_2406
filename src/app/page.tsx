"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
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

type SaveState = "saving" | "saved" | "failed";

function AppContent() {
  const { isLoading, fetchDiary, analyzeSchedule, saveDiary } = useApi();
  const { character, setCharacter, handleCharacterChange, hasChangedCharacter } =
    useCharacter();
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const saveSessionRef = useRef(0);
  const [loadingCharacter, setLoadingCharacter] = useState<number | null>(null);
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
  const displayCharacter = loadingCharacter !== null ? loadingCharacter : character;

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
      const charFromUrl = Number(url.slice(-1));
      if (Number.isInteger(charFromUrl) && charFromUrl >= 0 && charFromUrl <= 3) {
        setLoadingCharacter(charFromUrl);
      }
      startLoading();
      await fetchDiary(url, {
        onSuccess: (data) => {
          setCharacter(data.character);
          setQuery(data.schedule);

          const sorted = [...data.actions].sort((a, b) => a.idx - b.idx);
          setActions(sorted.map((item) => item.action));
          setSortedFeedbacks(sorted);

          setDiaryUrl(url);
          setGrandmaState("pastResponse");
          setIsResponseDisplayed(true);
          setLoadingCharacter(null);
        },
        onError: () => {
          setGrandmaState("error");
          setLoadingCharacter(null);
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
      if (!query.trim()) return;
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

        const sessionId = ++saveSessionRef.current;
        setSaveState("saving");
        saveDiary(data.diary_url, query, character, data.feedbacks).then(
          (ok) => {
            if (saveSessionRef.current !== sessionId) return;
            setSaveState(ok ? "saved" : "failed");
          }
        );
      } else {
        finishLoading(false);
      }
    },
    [
      query,
      character,
      analyzeSchedule,
      saveDiary,
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
        backgroundColor: BACKGROUND_COLORS[displayCharacter],
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <Header character={displayCharacter} onCharacterChange={onCharacterChange} />

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
              text={dialogData[displayCharacter]?.[grandmaState] ?? ""}
              onCharacterChange={onCharacterChange}
              isResponseDisplayed={isResponseDisplayed}
              character={displayCharacter}
              isLoading={isLoading}
              shouldPulse={shouldPulse}
            />

            <QueryInput
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              character={displayCharacter}
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
                  character={displayCharacter}
                  saveState={saveState}
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
