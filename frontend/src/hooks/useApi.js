import { useState, useCallback } from 'react';

const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

    const fetchDiary = useCallback(async (diaryUrl, callbacks) => {
        const {
            onLoadStart,
            onSuccess,
            onError,
            onLoadEnd
        } = callbacks;

        setIsLoading(true);
        onLoadStart && onLoadStart();

        try {
            const response = await fetch(`${apiBaseUrl}/api/get/diary/${diaryUrl}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onSuccess && onSuccess(data);
            return data;
        } catch (error) {
            console.error('Error fetching diary:', error);
            onError && onError(error);
            return null;
        } finally {
            setIsLoading(false);
            onLoadEnd && onLoadEnd();
        }
    }, [apiBaseUrl]);

    const extractActions = useCallback(async (query, character, callbacks) => {
        const {
            onLoadStart,
            onSuccess,
            onError,
            onLoadEnd
        } = callbacks;

        setIsLoading(true);
        onLoadStart && onLoadStart();

        try {
            const response = await fetch(`${apiBaseUrl}/api/extract-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schedule: query, character }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error response: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onSuccess && onSuccess(data);
            return data;
        } catch (error) {
            console.error('Error:', error);
            onError && onError(error);
            return null;
        } finally {
            setIsLoading(false);
            onLoadEnd && onLoadEnd();
        }
    }, [apiBaseUrl]);

    const getActionFeedback = useCallback(async (action, query, character, diaryId, idx) => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/action-feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    schedule: query,
                    character,
                    diary_id: diaryId,
                    idx
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting feedback:', error);
            return null;
        }
    }, [apiBaseUrl]);

    return {
        isLoading,
        fetchDiary,
        extractActions,
        getActionFeedback,
    };
};

export default useApi;
