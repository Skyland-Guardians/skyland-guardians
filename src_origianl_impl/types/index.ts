// Legacy Guardians - Type Definitions

import type { Dispatch, SetStateAction } from 'react';

// Asset Types
export interface Asset {
        key: string;
        name: string;
        expectedReturn: number;
        volatility: number;
        description: string;
        icon?: string;
}

// Artifact Types
export interface Artifact {
	key: string;
	name: string;
	icon: string;
        theme: 'forest' | 'snow' | 'palace' | 'starsea' | 'oasis' | 'lake' | 'temple';
	description: string;
	riskLevel: 'low' | 'medium' | 'high';
}

// Task Types
export interface Task {
	id: number;
	title: string;
	background: string;
	tip: string;
	objective: string;
	difficulty: 'easy' | 'medium' | 'hard';
}

// Event Types
export interface MarketEvent {
        id: number;
        name: string;
        description: string;
        affected: string[];
        impactRange: { [key: string]: [number, number] };
        probability: number;
        choices?: { text: string; impactRange: { [key: string]: [number, number] }; effect: string }[];
        icon?: string;
}

// Badge Types
export interface Badge {
        key: string;
        name: string;
        desc: string;
        requirement?: string;
        category?: 'diversification' | 'risk-management' | 'knowledge' | 'achievement';
        icon?: string;
}

// Dilemma Types
export interface DilemmaOption {
        text: string;
        consequence: string;
        skill: 'diversification' | 'risk-management' | 'knowledge';
}

export interface Dilemma {
        text: string;
        icon?: string;
        options: DilemmaOption[];
}

// AI Partner Types
export interface AIPartner {
        id: string;
        name: string;
        avatar: string;
        prompt: string;
        riskTolerance: 'low' | 'medium' | 'high';
        feedbackTemplates: string[];
}

// Game State Types
export interface GameState {
        day: number;
        weights: { [key: string]: number };
        returns: number | null;
        volatility: number | null;
        drawdown: number | null;
        coins: number;
        gems: number;
        badges: string[];
        history: GameHistory[];
}

export interface GameHistory {
        day: number;
        weights: { [key: string]: number };
        eventId?: number;
        effect?: string;
        returns: number;
        timestamp?: Date;
}

// User Types
export interface User {
	companyName: string;
	avatar: string;
	theme: 'cyberpunk' | 'classic' | 'meme';
	level: 'novice' | 'skilled' | 'expert' | 'master';
	experience: number;
}

// Component Props Types
export interface AssetAllocationProps {
	weights: { [key: string]: number };
	onWeightChange: (key: string, value: number) => void;
	artifacts: Artifact[];
}

export interface TaskCardProps {
	task: Task;
	currentDay: number;
}

export interface MarketEventProps {
	event: MarketEvent | null;
	onEventChoice: (choice: string) => void;
}

export interface AICompanionProps {
	partner: AIPartner;
	gameState: GameState;
	onAskQuestion: (question: string) => Promise<string>;
}

export interface BadgeDisplayProps {
	badges: string[];
	allBadges: Badge[];
	onBadgeClick: (badge: Badge) => void;
}

// API Response Types
export interface APIResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Game Configuration Types
export interface GameConfig {
	initialCoins: number;
	initialGems: number;
	wealthGoal: number;
	maxBadges: number;
	dailyEventProbability: number;
	dilemmaProbability: number;
	quizProbability: number;
}

// Theme Types
export interface ThemeConfig {
	name: string;
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	backgroundColor: string;
	textColor: string;
}
