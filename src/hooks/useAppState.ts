"use client";

import { useState, useCallback } from "react";
import type { FeedbackItem } from "@/lib/diary";

const useAppState = (initialGrandmaState = "initial") => {
  const [query, setQuery] = useState("");
  const [actions, setActions] = useState<string[]>([]);
  const [sortedFeedbacks, setSortedFeedbacks] = useState<FeedbackItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(initialGrandmaState === "loading");
  const [diaryUrl, setDiaryUrl] = useState<string | null>(null);
  const [grandmaState, setGrandmaState] = useState(initialGrandmaState);
  const [isDialogVisible, setIsDialogVisible] = useState(true);
  const [isResponseDisplayed, setIsResponseDisplayed] = useState(false);

  const startLoading = useCallback(() => {
    setActions([]);
    setSortedFeedbacks([]);
    setIsResponseDisplayed(false);
    setIsSubmitted(true);
    setGrandmaState("loading");
  }, []);

  const finishLoading = useCallback((success = true) => {
    setGrandmaState(success ? "waiting" : "error");
    if (success) {
      setIsDialogVisible(true);
      setIsResponseDisplayed(true);
    }
  }, []);

  return {
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
  };
};

export default useAppState;
