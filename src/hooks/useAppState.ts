"use client";

import { useState, useCallback } from "react";

type FeedbackItem = {
  face: number;
  action: string;
  feedback: string;
  idx: number;
};

const useAppState = () => {
  const [query, setQuery] = useState("");
  const [actions, setActions] = useState<string[]>([]);
  const [sortedFeedbacks, setSortedFeedbacks] = useState<FeedbackItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [diaryUrl, setDiaryUrl] = useState<string | null>(null);
  const [grandmaState, setGrandmaState] = useState("initial");
  const [isDialogVisible, setIsDialogVisible] = useState(true);
  const [isResponseDisplayed, setIsResponseDisplayed] = useState(false);
  const [isLoadingAdditionalInfo, setIsLoadingAdditionalInfo] = useState(false);

  const resetState = useCallback(() => {
    setActions([]);
    setSortedFeedbacks([]);
    setIsResponseDisplayed(false);
  }, []);

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
    setIsSubmitted,
    diaryUrl,
    setDiaryUrl,
    grandmaState,
    setGrandmaState,
    isDialogVisible,
    setIsDialogVisible,
    isResponseDisplayed,
    setIsResponseDisplayed,
    isLoadingAdditionalInfo,
    setIsLoadingAdditionalInfo,
    resetState,
    startLoading,
    finishLoading,
  };
};

export default useAppState;
