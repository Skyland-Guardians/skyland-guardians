import tasksData from './tasks.json';
import aiPersonalities from './ai-personalities.json';
import { taskGoals } from './task-goals';

const DEFAULT_COMPANY_NAME = '我的空岛公司';
const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/616/616494.png';

export const INITIAL_STATE = {
  companyName: DEFAULT_COMPANY_NAME,
  avatar: DEFAULT_AVATAR,
  theme: 'cyberpunk',
  coins: 100,
  gems: 5,
  stars: 0,
  progress: 0,
  allowedAssets: ['tech', 'bond', 'gold', 'crypto', 'esg', 'stablecoin', 'yield'],
  pendingCoinRequest: null as number | null,
  wheelOpen: false,
  wheelResult: null as string | null,
  wheelUsed: false,
  aiChatOpen: false,
  aiInput: '',
  aiResponse: '',
  aiPersonality: aiPersonalities[0].id,
  aiEnabled: true,
  dilemma: null,
  currentDilemmaIndex: null as number | null,
  quiz: null as { question: string; options: string[]; answer: string } | null,
  quizAnswered: null as string | null,
  endgame: false,
  showSummary: false,
  history: [] as any[],
  completedDilemmas: [] as number[],
  skillProgress: { diversification: 0, 'risk-management': 0, knowledge: 0 },
  weights: { tech: 16, bond: 16, gold: 16, crypto: 16, esg: 16, stablecoin: 10, yield: 10 },
  day: 0,
  returns: null as number | null,
  volatility: null as number | null,
  drawdown: null as number | null,
  portfolioValue: 1,
  peakValue: 1,
  event: null,
  task: tasksData[0],
  taskObjective: taskGoals[tasksData[0].id].objective,
  lastTaskResult: null as {
    title: string;
    completed: boolean;
    reward: { coins: number; gems: number; badge?: string };
  } | null,
  badges: [] as string[],
  showModal: false,
  modalContent: '',
  pendingCompanyName: DEFAULT_COMPANY_NAME,
  quizActive: false,
  quizResult: '',
};

