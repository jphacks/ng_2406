import { useState } from 'react';

const useAppState = () => {
    const [query, setQuery] = useState('');
    const [actions, setActions] = useState([]);
    const [sortedFeedbacks, setSortedFeedbacks] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [diaryUrl, setDiaryUrl] = useState(null);
    const [grandmaState, setGrandmaState] = useState('initial');
    const [isDialogVisible, setIsDialogVisible] = useState(true);
    const [isResponseDisplayed, setIsResponseDisplayed] = useState(false);
    const [isLoadingAdditionalInfo, setIsLoadingAdditionalInfo] = useState(false);

    const resetState = () => {
        setActions([]);
        setSortedFeedbacks([]);
        setIsResponseDisplayed(false);
    };

    const startLoading = () => {
        resetState();
        setIsSubmitted(true);
        setGrandmaState('loading');
    };

    const finishLoading = (success = true) => {
        setGrandmaState(success ? 'waiting' : 'error');
        if (success) {
            setIsDialogVisible(true);
            setIsResponseDisplayed(true);
        }
    };

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
