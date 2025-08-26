import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface GameAreaProps {
  task: any;
  taskObjective: string;
  lastTaskResult: { title: string; completed: boolean; reward: { coins: number; gems: number; badge?: string } } | null;
  event: any;
  history: any[];
  artifactsData: any[];
  weights: { [key: string]: number };
  returns: number | null;
  volatility: number | null;
  drawdown: number | null;
  onWeightChange: (key: string, value: number) => void;
  onNextDay: (choiceIndex?: number) => void;
  onResetGame: () => void;
  onShowModal: (content: string) => void;
}

// Styled Components
const GameAreaContainer = styled.div`
  flex: 1.2;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 1.2rem;
`;

const Card = styled.div`
  flex: 1;
`;

const TaskTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const TaskBackground = styled.div`
  margin-bottom: 4px;
`;

const TaskTip = styled.div`
  color: ${theme.colors.cyber.gray};
  font-size: 0.95rem;
`;

const EventContainer = styled.div`
  position: relative;
`;

const EventName = styled.strong`
  display: block;
  margin-bottom: 4px;
`;

const EventDescription = styled.div`
  margin-bottom: 8px;
`;

const EventEffectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const EventEffectImage = styled.img`
  width: 100%;
  height: 100%;
  opacity: 0.15;
  object-fit: cover;
`;

const EventChoices = styled.div`
  margin-top: 12px;
`;

const ChoiceButton = styled.button`
  margin-right: 8px;
`;

const NoEventText = styled.div`
  color: ${theme.colors.cyber.gray};
`;

const EventHistory = styled.div`
  margin-top: 12px;
  max-height: 120px;
  overflow-y: auto;
  font-size: 0.9rem;
  color: ${theme.colors.cyber.text};
`;

const HistoryItem = styled.div`
  margin-bottom: 4px;
`;

const AssetAllocationContainer = styled.div`
  /* 继承 legacy-card 样式 */
`;

const AssetsGrid = styled.div`
  display: flex;
  gap: 1.2rem;
`;

const AssetCard = styled.div<{ $theme: string }>`
  flex: 1;
  background: ${({ $theme }) =>
    $theme === 'forest' ? 'rgba(0,255,247,0.10)' :
    $theme === 'snow' ? 'rgba(0,234,255,0.10)' :
    $theme === 'palace' ? 'rgba(255,215,0,0.10)' :
    $theme === 'oasis' ? 'rgba(0,255,0,0.10)' :
    $theme === 'lake' ? 'rgba(30,144,255,0.10)' :
    $theme === 'temple' ? 'rgba(255,165,0,0.10)' :
    $theme === 'starsea' ? 'rgba(255,0,204,0.10)' :
    'rgba(255,0,204,0.10)'
  };
  border-radius: 12px;
  padding: 1rem;
  position: relative;
  box-shadow: 0 2px 8px ${theme.colors.cyber.primary}33;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const AssetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const AssetIcon = styled.span`
  font-size: 2rem;
  margin-right: 12px;
`;

const AssetLabel = styled.label`
  font-weight: 700;
  font-size: 1.1rem;
  flex: 1;
`;

const AssetSlider = styled.input`
  margin-bottom: 8px;
`;

const RiskMeterContainer = styled.div`
  height: 10px;
  border-radius: 5px;
  background: ${theme.colors.cyber.dark};
  margin: 8px 0;
  box-shadow: 0 0 4px ${theme.colors.cyber.secondary}99;
  overflow: hidden;
`;

const RiskMeterBar = styled.div<{ $width: number; $isHighRisk: boolean }>`
  width: ${({ $width }) => Math.min($width, 100)}%;
  height: 100%;
  border-radius: 5px;
  background: ${({ $isHighRisk }) => 
    $isHighRisk ? theme.colors.cyber.secondary : theme.colors.cyber.primary
  };
  transition: width 0.3s;
`;

const MiniChartButton = styled.div`
  height: 36px;
  width: 100%;
  background: linear-gradient(90deg, #222, #444);
  border-radius: 6px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.cyber.primary};
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 0 6px ${theme.colors.cyber.primary}99;
  transition: all ${theme.transitions.fast};
  text-align: center;
  white-space: nowrap;

  &:hover {
    box-shadow: 0 0 8px ${theme.colors.cyber.primary};
    transform: translateY(-1px);
  }
`;

const TotalAllocation = styled.div`
  margin-top: 8px;
  color: ${theme.colors.cyber.gray};
`;

const ReturnsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ReturnsInfo = styled.div`
  /* 基础样式 */
`;

const ReturnsTitle = styled.h2`
  font-size: 1.1rem;
  color: ${theme.colors.classic.primary};
`;

const ReturnsValue = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActionButton = styled.button`
  margin-top: 0;
`;

export const GameArea: React.FC<GameAreaProps> = ({
  task,
  taskObjective,
  lastTaskResult,
  event,
  history,
  artifactsData,
  weights,
  returns,
  volatility,
  drawdown,
  onWeightChange,
  onNextDay,
  onResetGame,
  onShowModal
}) => {
  const handleChange = (key: string, value: number) => {
    const total = Object.entries(weights).reduce((sum, [k, v]) => 
      k === key ? sum + value : sum + (v as number), 0
    );
    if (total <= 100) {
      onWeightChange(key, value);
    }
  };

  return (
    <GameAreaContainer>
      {/* Task and Event Cards */}
      <CardsContainer>
        <Card className="legacy-card">
          <h2 className="legacy-task">任务卡</h2>
          <TaskTitle>{task?.title || '暂无任务'}</TaskTitle>
          <TaskBackground>{task?.background || ''}</TaskBackground>
          <TaskTip>{task?.tip || ''}</TaskTip>
          {taskObjective && <TaskTip>目标：{taskObjective}</TaskTip>}
          {lastTaskResult && (
            <TaskTip>
              上个任务{lastTaskResult.completed ? `完成✅ 奖励：+${lastTaskResult.reward.coins}币 +${lastTaskResult.reward.gems}宝石${lastTaskResult.reward.badge ? ` +徽章：${lastTaskResult.reward.badge}` : ''}` : '未完成❌'}
            </TaskTip>
          )}
        </Card>
        
        <Card className="legacy-card">
          <h2 className="legacy-event">市场事件</h2>
          {event ? (
            <EventContainer>
              <EventName>{event.name}</EventName>
              <EventDescription>{event.description}</EventDescription>
              
              {/* Animated event effect overlay */}
              <EventEffectOverlay>
                {event.name.includes('风暴') && (
                  <EventEffectImage 
                    src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" 
                    alt="storm" 
                  />
                )}
                {event.name.includes('牛市') && (
                  <EventEffectImage 
                    src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" 
                    alt="bull" 
                  />
                )}
              </EventEffectOverlay>
              
              {/* Event choices (for advanced events) */}
              {event.choices && Array.isArray(event.choices) && (
                <EventChoices>
                  {event.choices.map((choice: any, idx: number) => (
                    <ChoiceButton
                      key={choice.text}
                      className="legacy-btn"
                      onClick={() => onNextDay(idx)}
                    >
                      {choice.text}
                    </ChoiceButton>
                  ))}
                </EventChoices>
              )}
            </EventContainer>
          ) : (
            <NoEventText>暂无事件</NoEventText>
          )}
        </Card>
      </CardsContainer>

      {history.length > 0 && (
        <Card className="legacy-card">
          <h2 className="legacy-task">事件记录</h2>
          <EventHistory>
            {history.map(h => (
              h.eventId ? (
                <HistoryItem key={h.day}>
                  第{h.day}天: 事件 {h.eventId} - {h.effect}
                </HistoryItem>
              ) : null
            ))}
          </EventHistory>
        </Card>
      )}

      {/* Asset Allocation */}
      <AssetAllocationContainer className="legacy-card">
        <h2 className="legacy-progress">资产分配</h2>
        <AssetsGrid>
          {artifactsData.map(artifact => (
            <AssetCard key={artifact.key} $theme={artifact.theme}>
              <AssetHeader>
                <AssetIcon>{artifact.icon}</AssetIcon>
                <AssetLabel>
                  {artifact.name}: <strong>{weights[artifact.key] || 0}%</strong>
                </AssetLabel>
              </AssetHeader>
              
              <AssetSlider
                type="range"
                min={0}
                max={100}
                value={weights[artifact.key] || 0}
                onChange={e => handleChange(artifact.key, Number(e.target.value))}
                className="legacy-slider"
              />
              
              {/* Risk meter bar */}
              <RiskMeterContainer>
                <RiskMeterBar 
                  $width={weights[artifact.key] || 0} 
                  $isHighRisk={(weights[artifact.key] || 0) > 60}
                />
              </RiskMeterContainer>
              
              {/* Mini chart clickable */}
              <MiniChartButton
                title={`点击查看${artifact.name}详情`}
                onClick={() => {
                  onShowModal(`${artifact.name}（${artifact.icon}）\n\n权重: ${weights[artifact.key] || 0}%\n\n此资产代表：${
                    artifact.theme === 'forest' ? '科技股' :
                    artifact.theme === 'snow' ? '债券' :
                    artifact.theme === 'palace' ? '黄金' :
                    artifact.theme === 'oasis' ? 'ESG' :
                    artifact.theme === 'lake' ? '稳定币' :
                    artifact.theme === 'temple' ? '收益资产' :
                    '加密货币'
                  }\n\n风险提示: ${(weights[artifact.key] || 0) > 60 ? '集中风险' : '分散配置'}`);
                }}
              >
                点击查看 Mini Chart
              </MiniChartButton>
            </AssetCard>
          ))}
        </AssetsGrid>
        
        <TotalAllocation>
          总分配: <strong>{Object.values(weights).reduce((a, b) => (a as number) + (b as number), 0)}%</strong>
        </TotalAllocation>
      </AssetAllocationContainer>

      {/* Returns and Actions */}
      <ReturnsContainer className="legacy-card">
        <ReturnsInfo>
          <ReturnsTitle>当日收益</ReturnsTitle>
          <ReturnsValue>
            {returns !== null ? `${returns}%` : '请点击"下一天"模拟收益'}
          </ReturnsValue>
          {volatility !== null && (
            <div>
              波动率: {volatility}%{volatility > 20 ? ' ⚠️ 波动较高' : ''}
            </div>
          )}
          {drawdown !== null && (
            <div>
              回撤: {drawdown}%{drawdown < -20 ? ' ⚠️ 回撤严重' : ''}
            </div>
          )}
        </ReturnsInfo>
        
        <ActionButtons>
          <ActionButton
            className="legacy-btn"
            onClick={() => onNextDay()}
            disabled={event && event.choices && event.choices.length > 0}
          >
            下一天
          </ActionButton>
          <ActionButton className="legacy-btn legacy-reset" onClick={onResetGame}>
            重置游戏
          </ActionButton>
        </ActionButtons>
      </ReturnsContainer>
    </GameAreaContainer>
  );
};
