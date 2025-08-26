// Legacy Guardians - Game State Hook

import { useState, useCallback } from 'react';
import { Dilemma } from '../types';
import tasksData from '../constants/tasks.json';
import { events as eventsData } from '../modules/events';
import { dilemmas as dilemmaQuestions } from '../modules/dilemmas';
import { handleSpinWheel as spinWheel } from '../modules/spinWheel';
import aiPersonalities from '../constants/ai-personalities.json';
import { assets as assetsData } from '../modules/assets';
import { getAiResponse } from '../utils/ai';
import { taskGoals } from '../constants/task-goals';
import {
  calculateDailyReturns,
  generateRandomEvent,
  checkGameEnd,
  sanitizeWeights,
} from '../utils/game-logic';
import { GAME_CONFIG } from '../constants/game-config';
import {
  resolveEventChoice,
  applyDailyRewards,
  maybeTriggerEncounter,
} from '../utils/daily-helpers';
import { INITIAL_STATE } from '../constants/initial-state';

export const useGameState = () => {
  // Company/Avatar Customization
  const [companyName, setCompanyName] = useState(INITIAL_STATE.companyName);
  const [avatar, setAvatar] = useState(INITIAL_STATE.avatar);
  const [theme, setTheme] = useState(INITIAL_STATE.theme);

  // Resource Management
  const [coins, setCoins] = useState(INITIAL_STATE.coins);
  const [gems, setGems] = useState(INITIAL_STATE.gems);
  const [stars, setStars] = useState(INITIAL_STATE.stars);
  const [progress, setProgress] = useState(INITIAL_STATE.progress);
  const [allowedAssets, setAllowedAssets] = useState<string[]>([...INITIAL_STATE.allowedAssets]);
  const [pendingCoinRequest, setPendingCoinRequest] = useState<number | null>(INITIAL_STATE.pendingCoinRequest);

  // Spin the Wheel state
  const [wheelOpen, setWheelOpen] = useState(INITIAL_STATE.wheelOpen);
  const [wheelResult, setWheelResult] = useState<string | null>(INITIAL_STATE.wheelResult);
  const [wheelUsed, setWheelUsed] = useState(INITIAL_STATE.wheelUsed);

  // AI chat state
  const [aiChatOpen, setAiChatOpen] = useState(INITIAL_STATE.aiChatOpen);
  const [aiInput, setAiInput] = useState(INITIAL_STATE.aiInput);
  const [aiResponse, setAiResponse] = useState(INITIAL_STATE.aiResponse);
  const [aiPersonality, setAiPersonality] = useState<string>(INITIAL_STATE.aiPersonality);
  const [aiEnabled, setAiEnabled] = useState(INITIAL_STATE.aiEnabled);

  // Dilemma/Quiz state
  const [dilemma, setDilemma] = useState<Dilemma | null>(INITIAL_STATE.dilemma);
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState<number | null>(INITIAL_STATE.currentDilemmaIndex);
  const [quiz, setQuiz] = useState<{ question: string, options: string[], answer: string } | null>(INITIAL_STATE.quiz);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(INITIAL_STATE.quizAnswered);

  // Main game state
  const [endgame, setEndgame] = useState(INITIAL_STATE.endgame);
  const [showSummary, setShowSummary] = useState(INITIAL_STATE.showSummary);
  const [history, setHistory] = useState<any[]>([...INITIAL_STATE.history]);
  const [completedDilemmas, setCompletedDilemmas] = useState<number[]>([...INITIAL_STATE.completedDilemmas]);
  const [skillProgress, setSkillProgress] = useState<{ [key: string]: number }>({ ...INITIAL_STATE.skillProgress });
  const [weights, setWeights] = useState<{ [key: string]: number }>({ ...INITIAL_STATE.weights });
  const [day, setDay] = useState(INITIAL_STATE.day);
  const [returns, setReturns] = useState<number | null>(INITIAL_STATE.returns);
  const [volatility, setVolatility] = useState<number | null>(INITIAL_STATE.volatility);
  const [drawdown, setDrawdown] = useState<number | null>(INITIAL_STATE.drawdown);
  const [portfolioValue, setPortfolioValue] = useState(INITIAL_STATE.portfolioValue);
  const [peakValue, setPeakValue] = useState(INITIAL_STATE.peakValue);
  const cumulativeReturn = (portfolioValue - 1) * 100;
  const [event, setEvent] = useState<any>(INITIAL_STATE.event);
  const [task, setTask] = useState<any>(INITIAL_STATE.task);
  const [taskObjective, setTaskObjective] = useState<string>(INITIAL_STATE.taskObjective);
  const [lastTaskResult, setLastTaskResult] = useState<
    { title: string; completed: boolean; reward: { coins: number; gems: number; badge?: string } } | null
  >(INITIAL_STATE.lastTaskResult);
  const [badges, setBadges] = useState<string[]>([...INITIAL_STATE.badges]);

  // Sidebar/modal state
  const [showModal, setShowModal] = useState(INITIAL_STATE.showModal);
  const [modalContent, setModalContent] = useState<string>(INITIAL_STATE.modalContent);
  const [pendingCompanyName, setPendingCompanyName] = useState(INITIAL_STATE.pendingCompanyName);

  // Quiz state
  const [quizActive, setQuizActive] = useState(INITIAL_STATE.quizActive);
  const [quizResult, setQuizResult] = useState(INITIAL_STATE.quizResult);

  // Avatar options
  const avatarOptions = [
    'https://cdn-icons-png.flaticon.com/512/616/616494.png',
    'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    'https://cdn-icons-png.flaticon.com/512/616/616430.png',
    'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    'https://cdn-icons-png/flaticon.com/512/616/616408.png',
    'https://cdn-icons-png.flaticon.com/512/616/616408.png'
  ];

  // Parent controls
  const requestCoins = useCallback((amount: number) => {
    setPendingCoinRequest(amount);
  }, []);

  const approveCoinRequest = useCallback(() => {
    if (pendingCoinRequest !== null) {
      setCoins(c => c + pendingCoinRequest);
      setPendingCoinRequest(null);
    }
  }, [pendingCoinRequest]);

  const rejectCoinRequest = useCallback(() => setPendingCoinRequest(null), []);

  const toggleAllowedAsset = useCallback((asset: string) => {
    setAllowedAssets(prev => {
      if (prev.includes(asset)) {
        setWeights(w => ({ ...w, [asset]: 0 }));
        return prev.filter(a => a !== asset);
      }
      return [...prev, asset];
    });
  }, [setWeights]);

  const addStars = useCallback((count: number = 1) => {
    setStars(prev => {
      const newStars = prev + count;
      const newProgress = Math.min(100, Math.floor(newStars / 5) * 25);
      setProgress(newProgress);
      return newStars;
    });
  }, []);

  const handleDilemmaAnswer = useCallback((optionIndex: number) => {
    if (!dilemma || currentDilemmaIndex === null) return '';
    const option = dilemma.options[optionIndex];
    setCompletedDilemmas(prev => [...prev, currentDilemmaIndex]);
    setSkillProgress(prev => ({
      ...prev,
      [option.skill]: (prev[option.skill] || 0) + 1,
    }));
    setCurrentDilemmaIndex(null);
    return option.consequence;
  }, [dilemma, currentDilemmaIndex]);


  // Handle spin wheel
  const handleSpinWheel = useCallback(() => {
    spinWheel({
      setReturns,
      setBadges,
      setWheelResult,
      setWheelUsed,
      setWheelOpen,
    });
  }, [setReturns, setBadges, setWheelResult, setWheelUsed, setWheelOpen]);

  // Handle AI ask
  const handleAiAsk = useCallback(async () => {
    const input = aiInput.trim();
    if (!input || !aiEnabled) return;
    setAiResponse('正在思考...');
    const personality = aiPersonalities.find(p => p.id === aiPersonality) || aiPersonalities[0];
    const reply = await getAiResponse(input, weights, personality);
    setAiResponse(reply);
  }, [aiInput, weights, aiPersonality, aiEnabled]);

  // Reset game function
  const resetGame = useCallback(() => {
    const resetState: Record<string, (value: any) => void> = {
      weights: setWeights,
      day: setDay,
      returns: setReturns,
      event: setEvent,
      task: setTask,
      taskObjective: setTaskObjective,
      lastTaskResult: setLastTaskResult,
      badges: setBadges,
      history: setHistory,
      volatility: setVolatility,
      drawdown: setDrawdown,
      portfolioValue: setPortfolioValue,
      peakValue: setPeakValue,
      quizActive: setQuizActive,
      quizResult: setQuizResult,
      coins: setCoins,
      gems: setGems,
      stars: setStars,
      progress: setProgress,
      endgame: setEndgame,
      showSummary: setShowSummary,
      dilemma: setDilemma,
      currentDilemmaIndex: setCurrentDilemmaIndex,
      completedDilemmas: setCompletedDilemmas,
      skillProgress: setSkillProgress,
    };

    Object.entries(resetState).forEach(([key, setter]) => {
      const value = (INITIAL_STATE as any)[key];
      if (Array.isArray(value)) {
        setter([...value]);
      } else if (value && typeof value === 'object') {
        setter({ ...value });
      } else {
        setter(value);
      }
    });
  }, []);

  // Handle weight change
  const handleWeightChange = useCallback((key: string, value: number) => {
    const sanitized = sanitizeWeights(weights, allowedAssets);

    if (!allowedAssets.includes(key)) {
      setWeights(sanitized);
      return;
    }

    const total = Object.entries(sanitized).reduce(
      (sum, [k, v]) => (k === key ? sum + value : sum + (v as number)),
      0
    );

    if (total <= 100) {
      setWeights({ ...sanitized, [key]: value });
    } else {
      setWeights(sanitized);
    }
  }, [weights, allowedAssets]);

  // Next day function
  const nextDay = useCallback((choiceIndex?: number) => {
    if (event && event.choices && choiceIndex !== undefined) {
      const resolution = resolveEventChoice({
        event,
        choiceIndex,
        weights,
        assets: assetsData,
        portfolioValue,
        peakValue,
      });
      const dayReturn = resolution.result.returns;
      setReturns(dayReturn);
      setVolatility(resolution.result.volatility);
      setDrawdown(resolution.result.drawdown);
      setPortfolioValue(resolution.result.portfolioValue);
      setPeakValue(resolution.result.peakValue);

      const rewards = applyDailyRewards({
        dayReturn,
        weights,
        day,
        task,
        taskGoals,
        badges,
        history,
        allowedAssets,
        eventId: event.id,
        effect: resolution.effect,
      });

      setCoins(c => c + rewards.coins);
      setGems(g => g + rewards.gems);
      if (rewards.stars > 0) addStars(rewards.stars);
      setBadges(rewards.newBadges);
      setHistory([...history, rewards.historyEntry]);
      setLastTaskResult(rewards.lastTaskResult);

      const taskIdx = (day + 1) % tasksData.length;
      setTask(tasksData[taskIdx]);
      setTaskObjective(taskGoals[tasksData[taskIdx].id].objective);
      setDay(day + 1);

      setEvent(resolution.updatedEvent);
      setWheelUsed(false);
      return;
    }

    setWheelUsed(false);

    const encounter = maybeTriggerEncounter(
      dilemmaQuestions,
      completedDilemmas,
      GAME_CONFIG.QUIZ_QUESTIONS
    );
    if (encounter) {
      if (encounter.type === 'easterEgg') {
        setShowModal(true);
        setModalContent(encounter.message!);
        setReturns(r => (r !== null ? r + encounter.returnsBonus! : encounter.returnsBonus!));
        setCoins(c => c + (encounter.coins || 0));
        setGems(g => g + (encounter.gems || 0));
      }
      if (encounter.type === 'dilemma') {
        setDilemma(encounter.dilemma!);
        setCurrentDilemmaIndex(encounter.index!);
        return;
      }
      if (encounter.type === 'quiz') {
        setQuiz(encounter.quiz);
        return;
      }
    }

    // Endgame trigger
    if (
      checkGameEnd(cumulativeReturn, badges, GAME_CONFIG.MAX_BADGES) &&
      !endgame
    ) {
      setEndgame(true);
      setTimeout(() => setShowSummary(true), 2500);
    }

    // Pick a random event
    const ev = generateRandomEvent(eventsData);
    setEvent(ev);

    // If event has choices, wait for user decision
    if (ev && ev.choices && ev.choices.length > 0) {
      return;
    }

    const taskIdx = (day + 1) % tasksData.length;
    setTask(tasksData[taskIdx]);
    setTaskObjective(taskGoals[tasksData[taskIdx].id].objective);
    setDay(day + 1);

    const result = calculateDailyReturns(weights, assetsData, ev, portfolioValue, peakValue);
    const dayReturn = result.returns;
    setReturns(dayReturn);
    setVolatility(result.volatility);
    setDrawdown(result.drawdown);
    setPortfolioValue(result.portfolioValue);
    setPeakValue(result.peakValue);

    const rewards = applyDailyRewards({
      dayReturn,
      weights,
      day,
      task,
      taskGoals,
      badges,
      history,
      allowedAssets,
      eventId: ev ? ev.id : undefined,
      effect: ev ? ev.description : undefined,
    });

    setCoins(c => c + rewards.coins);
    setGems(g => g + rewards.gems);
    if (rewards.stars > 0) addStars(rewards.stars);
    setBadges(rewards.newBadges);
    setHistory([...history, rewards.historyEntry]);
    setLastTaskResult(rewards.lastTaskResult);
  }, [day, badges, weights, history, completedDilemmas, portfolioValue, peakValue, event, task, allowedAssets, endgame, cumulativeReturn]);

  return {
    // State
    companyName,
    avatar,
    theme,
    coins,
    gems,
    stars,
    progress,
    wheelOpen,
    wheelResult,
    wheelUsed,
    aiChatOpen,
    aiInput,
    aiResponse,
    dilemma,
    quiz,
    quizAnswered,
    endgame,
    showSummary,
    history,
    weights,
    day,
    returns,
    volatility,
    drawdown,
    portfolioValue,
    cumulativeReturn,
    event,
    task,
    taskObjective,
    lastTaskResult,
    badges,
    showModal,
    modalContent,
    pendingCompanyName,
    quizActive,
    quizResult,
    allowedAssets,
    pendingCoinRequest,
    aiPersonality,
    aiEnabled,
    completedDilemmas,
    skillProgress,
    
    // Options
    avatarOptions,
    dilemmaQuestions,
    
    // Actions
    setCompanyName,
    setAvatar,
    setTheme,
    setCoins,
    setGems,
    setStars,
    setProgress,
    setWheelOpen,
    setWheelResult,
    setWheelUsed,
    setAiChatOpen,
    setAiInput,
    setAiResponse,
    setAiPersonality,
    setAiEnabled,
    setDilemma,
    setQuiz,
    setQuizAnswered,
    setEndgame,
    setShowSummary,
    setHistory,
    setWeights,
    setDay,
    setReturns,
    setVolatility,
    setDrawdown,
    setEvent,
    setTask,
    setBadges,
    setShowModal,
    setModalContent,
    setPendingCompanyName,
    setQuizActive,
    setQuizResult,

    // Functions
    handleSpinWheel,
    handleAiAsk,
    resetGame,
    handleWeightChange,
    nextDay,
    requestCoins,
    approveCoinRequest,
    rejectCoinRequest,
    toggleAllowedAsset,
    addStars,
    handleDilemmaAnswer
  };
};
