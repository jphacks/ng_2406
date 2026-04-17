"use client";

import { useState, useCallback } from "react";

type FetchDiaryCallbacks = {
  onLoadStart?: () => void;
  onSuccess?: (data: DiaryResponse) => void;
  onError?: (error: Error) => void;
  onLoadEnd?: () => void;
};

type DiaryResponse = {
  created_at: string;
  schedule: string;
  character: number;
  actions: { action: string; feedback: string; face: number; idx: number }[];
};

type AnalyzeCallbacks = {
  onSuccess?: (data: AnalyzeResponse) => void;
  onError?: (error: Error) => void;
};

type FeedbackItem = {
  action: string;
  face: number;
  feedback: string;
  idx: number;
};

type AnalyzeResponse = {
  diary_url: string;
  feedbacks: FeedbackItem[];
};

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchDiary = useCallback(
    async (diaryUrl: string, callbacks: FetchDiaryCallbacks) => {
      const { onLoadStart, onSuccess, onError, onLoadEnd } = callbacks;

      setIsLoading(true);
      onLoadStart?.();

      try {
        const response = await fetch(`/api/get/diary/${diaryUrl}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: DiaryResponse = await response.json();
        onSuccess?.(data);
        return data;
      } catch (error) {
        console.error("Error fetching diary:", error);
        onError?.(error as Error);
        return null;
      } finally {
        setIsLoading(false);
        onLoadEnd?.();
      }
    },
    []
  );

  const analyzeSchedule = useCallback(
    async (
      query: string,
      character: number,
      callbacks: AnalyzeCallbacks
    ): Promise<AnalyzeResponse | null> => {
      const { onSuccess, onError } = callbacks;

      setIsLoading(true);

      try {
        const response = await fetch("/api/extract-actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schedule: query, character }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error response: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AnalyzeResponse = await response.json();
        onSuccess?.(data);
        return data;
      } catch (error) {
        console.error("Error:", error);
        onError?.(error as Error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    fetchDiary,
    analyzeSchedule,
  };
};

export default useApi;
