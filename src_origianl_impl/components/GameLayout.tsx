import React, { useState } from 'react';
import { TopBar, Sidebar, GameArea, FloatingButtons, Modals } from './index';
import { ParentControlPanel } from './ParentControlPanel';
import { useGameState } from '../hooks/useGameState';
import artifactsData from '../constants/artifacts.json';
import { badges as badgesData } from '../modules/badges';
import aiPersonalities from '../constants/ai-personalities.json';

export const GameLayout: React.FC = () => {
  const gameState = useGameState();
  const [parentOpen, setParentOpen] = useState(false);
  
  const {
    // State
    companyName, avatar, theme, coins, gems, stars, wheelOpen, wheelResult, wheelUsed,
    aiChatOpen, aiInput, aiResponse, dilemma, quiz, quizAnswered, endgame,
    showSummary, history, weights, day, returns, volatility, drawdown, event, task, taskObjective, lastTaskResult, badges,
    showModal, modalContent, pendingCompanyName, avatarOptions,
    allowedAssets, pendingCoinRequest, aiPersonality, aiEnabled,

    // Actions
    setCompanyName, setAvatar, setTheme, setWheelOpen, setWheelResult, setWheelUsed,
    setAiChatOpen, setAiInput, setAiResponse, setAiPersonality, setAiEnabled, setDilemma, setQuiz, setQuizAnswered,
    setEndgame, setShowSummary, setShowModal, setModalContent, setPendingCompanyName,

    // Functions
    handleSpinWheel, handleAiAsk, resetGame, handleWeightChange, nextDay,
    requestCoins, approveCoinRequest, rejectCoinRequest, toggleAllowedAsset, handleDilemmaAnswer
  } = gameState;

  const aiPartnerData = aiPersonalities.find(p => p.id === aiPersonality) || aiPersonalities[0];

  // Event handlers
  const handlers = {
    editCompany: () => { setShowModal(true); setModalContent('edit'); setPendingCompanyName(companyName); },
    modalClose: () => { setShowModal(false); setModalContent(''); },
    wheelClose: () => { setWheelOpen(false); setWheelResult(null); },
    aiChatClose: () => { setAiChatOpen(false); setAiInput(''); setAiResponse(''); },
    dilemmaClose: () => { setDilemma(null); nextDay(); },
    quizAnswer: (answer: string) => {
      setQuizAnswered(answer);
      setTimeout(() => { setQuiz(null); setQuizAnswered(null); nextDay(); }, 1200);
    },
    endgameClose: () => setEndgame(false),
    summaryClose: () => { setShowSummary(false); setEndgame(false); resetGame(); },
    badgeClick: (badge: any) => { setShowModal(true); setModalContent(`${badge.name}\n\n${badge.desc}`); },
    requestCoins: () => requestCoins(20),
    parentOpen: () => setParentOpen(true),
    parentClose: () => setParentOpen(false),
    toggleAi: (enabled: boolean) => { setAiEnabled(enabled); if (!enabled) { setAiChatOpen(false); } },
    changePersonality: (id: string) => setAiPersonality(id)
  };

  return (
    <div className="legacy-container" style={{ paddingTop: 0, maxWidth: '1200px', margin: '2rem auto' }}>
      <TopBar
        {...{ companyName, avatar, day, coins, gems, stars, theme }}
        onEditCompany={handlers.editCompany}
        onRequestCoins={handlers.requestCoins}
      />
      
      <FloatingButtons
        wheelOpen={wheelOpen} wheelResult={wheelResult} wheelUsed={wheelUsed} aiChatOpen={aiChatOpen}
        aiEnabled={aiEnabled}
        onWheelOpen={() => setWheelOpen(true)} onWheelClose={handlers.wheelClose}
        onSpinWheel={handleSpinWheel} onAiChatOpen={() => setAiChatOpen(true)} onAiChatClose={handlers.aiChatClose}
        onParentOpen={handlers.parentOpen}
      />

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'nowrap', marginBottom: '2rem' }}>
        <Sidebar {...{ aiPartnerData, badgesData, badges, history, stars }} onBadgeClick={handlers.badgeClick} />
        
        <GameArea
          task={task}
          taskObjective={taskObjective}
          lastTaskResult={lastTaskResult}
          event={event}
          history={history}
          artifactsData={artifactsData.filter(a => allowedAssets.includes(a.key))}
          weights={weights}
          returns={returns}
          volatility={volatility}
          drawdown={drawdown}
          onWeightChange={handleWeightChange}
          onNextDay={nextDay}
          onResetGame={resetGame}
          onShowModal={(content) => { setShowModal(true); setModalContent(content); }}
        />
      </div>

      {parentOpen && (
        <ParentControlPanel
          pendingRequest={pendingCoinRequest}
          allowedAssets={allowedAssets}
          aiEnabled={aiEnabled}
          aiPersonality={aiPersonality}
          aiPersonalities={aiPersonalities}
          history={history}
          badges={badges}
          aiNote={aiResponse}
          onApprove={approveCoinRequest}
          onReject={rejectCoinRequest}
          onToggleAsset={toggleAllowedAsset}
          onToggleAi={handlers.toggleAi}
          onPersonalityChange={handlers.changePersonality}
          onClose={handlers.parentClose}
        />
      )}

      <Modals
        showModal={showModal} modalContent={modalContent} aiChatOpen={aiChatOpen}
        dilemma={dilemma} quiz={quiz} quizAnswered={quizAnswered} endgame={endgame} showSummary={showSummary}
        companyName={companyName} avatar={avatar} avatarOptions={avatarOptions} theme={theme}
        pendingCompanyName={pendingCompanyName} aiPartnerData={aiPartnerData} aiInput={aiInput}
        aiResponse={aiResponse} returns={returns} badges={badges}
        onModalClose={handlers.modalClose} onCompanyNameChange={setCompanyName} onAvatarChange={setAvatar}
        onThemeChange={setTheme} onPendingCompanyNameChange={setPendingCompanyName}
        onDilemmaClose={handlers.dilemmaClose} onDilemmaAnswer={handleDilemmaAnswer} onQuizAnswer={handlers.quizAnswer}
        onQuizClose={() => setQuiz(null)} onEndgameClose={handlers.endgameClose}
        onSummaryClose={handlers.summaryClose} onAiInputChange={setAiInput}
        onAiAsk={handleAiAsk} onAiChatClose={handlers.aiChatClose} onResetGame={resetGame}
      />
    </div>
  );
};
