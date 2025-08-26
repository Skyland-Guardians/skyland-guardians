import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import type { AIPartner, Dilemma } from '../types';

interface ModalsProps {
  showModal: boolean;
  modalContent: string;
  aiChatOpen: boolean;
  dilemma: Dilemma | null;
  quiz: any;
  quizAnswered: string | null;
  endgame: boolean;
  showSummary: boolean;
  companyName: string;
  avatar: string;
  avatarOptions: string[];
  theme: string;
  pendingCompanyName: string;
  aiPartnerData: AIPartner;
  aiInput: string;
  aiResponse: string;
  returns: number | null;
  badges: string[];
  onModalClose: () => void;
  onCompanyNameChange: (name: string) => void;
  onAvatarChange: (avatar: string) => void;
  onThemeChange: (theme: string) => void;
  onPendingCompanyNameChange: (name: string) => void;
  onDilemmaClose: () => void;
  onDilemmaAnswer: (optionIndex: number) => string;
  onQuizAnswer: (answer: string) => void;
  onQuizClose: () => void;
  onEndgameClose: () => void;
  onSummaryClose: () => void;
  onAiInputChange: (input: string) => void;
  onAiAsk: () => void;
  onAiChatClose: () => void;
  onResetGame: () => void;
}

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div<{ $variant: 'edit' | 'ai' | 'dilemma' | 'quiz' | 'general' }>`
  background: ${({ $variant }) => 
    $variant === 'edit' ? theme.colors.cyber.text : theme.colors.cyber.dark
  };
  color: ${({ $variant }) => 
    $variant === 'edit' ? theme.colors.cyber.dark : theme.colors.cyber.text
  };
  border-radius: 16px;
  padding: 32px;
  min-width: 320px;
  max-width: 480px;
  box-shadow: 0 0 32px ${({ $variant }) => 
    $variant === 'edit' ? `${theme.colors.meme.primary}cc` : `${theme.colors.cyber.primary}cc`
  };
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalCloseButton = styled.span<{ $color: string }>`
  position: absolute;
  top: 12px;
  right: 18px;
  font-size: 22px;
  cursor: pointer;
  color: ${({ $color }) => $color};
  transition: color ${theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const ModalTitle = styled.h2<{ $color: string }>`
  color: ${({ $color }) => $color};
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  font-weight: 700;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid ${theme.colors.cyber.accent};
  font-size: 16px;
  margin-bottom: 8px;
  background: ${theme.colors.meme.primary}22;
  color: ${theme.colors.cyber.dark};
  transition: border-color ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.cyber.primary};
  }
`;

const FormSelect = styled.select`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid ${theme.colors.cyber.accent};
  font-size: 16px;
  margin-bottom: 8px;
  background: ${theme.colors.meme.primary}22;
  color: ${theme.colors.cyber.dark};
  transition: border-color ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.cyber.primary};
  }
`;

const AvatarOptions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const AvatarOption = styled.img<{ $selected: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: ${({ $selected }) => 
    $selected ? `3px solid ${theme.colors.cyber.accent}` : '2px solid #ccc'
  };
  cursor: pointer;
  box-shadow: ${({ $selected }) => 
    $selected ? `0 0 8px ${theme.colors.cyber.accent}` : 'none'
  };
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`;

const ModalButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  background: ${({ $variant }) => 
    $variant === 'primary' ? theme.colors.cyber.accent : theme.colors.cyber.primary
  };
  color: ${({ $variant }) => 
    $variant === 'primary' ? theme.colors.cyber.text : theme.colors.cyber.dark
  };
  margin-top: 12px;
  transition: all ${theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

const AiPartnerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const AiPartnerAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 0 0 8px ${theme.colors.cyber.primary};
`;

const AiPartnerName = styled.span`
  font-weight: 700;
  color: ${theme.colors.cyber.primary};
`;

const AiDescription = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
`;

const AiInput = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid ${theme.colors.cyber.primary};
  font-size: 16px;
  margin-bottom: 8px;
  background: #111;
  color: ${theme.colors.cyber.text};
  transition: border-color ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.cyber.secondary};
  }
`;

const AiResponse = styled.div`
  background: #333;
  color: ${theme.colors.cyber.primary};
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  margin-top: 8px;
`;

const DilemmaText = styled.div`
  font-size: 18px;
  margin-bottom: 24px;
`;

const DilemmaOptions = styled.div`
  display: flex;
  gap: 16px;
`;

const QuizQuestion = styled.div`
  font-size: 18px;
  margin-bottom: 24px;
`;

const QuizOptions = styled.div`
  display: flex;
  gap: 16px;
`;

const QuizResult = styled.div<{ $correct: boolean }>`
  margin-top: 18px;
  color: ${({ $correct }) => 
    $correct ? theme.colors.cyber.success : theme.colors.cyber.error
  };
  font-weight: 700;
`;

const EndgameOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EndgameImage = styled.img`
  width: 180px;
  height: 180px;
  margin-bottom: 24px;
`;

const EndgameTitle = styled.h2`
  color: ${theme.colors.cyber.primary};
  font-size: 2rem;
  text-shadow: 0 0 16px ${theme.colors.cyber.secondary};
  margin-bottom: 12px;
`;

const EndgameDescription = styled.div`
  color: ${theme.colors.cyber.text};
  text-align: center;
`;

const SummaryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.95);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const SummaryTitle = styled.h2`
  color: ${theme.colors.cyber.secondary};
  font-size: 2rem;
  margin-bottom: 16px;
`;

const SummaryContent = styled.div`
  color: ${theme.colors.cyber.text};
  font-size: 1.2rem;
  margin-bottom: 16px;
  text-align: center;
`;

const SummaryItem = styled.div`
  margin-bottom: 8px;
`;

const GeneralModalContent = styled.pre`
  white-space: pre-wrap;
  font-size: 16px;
`;

export const Modals: React.FC<ModalsProps> = ({
  showModal,
  modalContent,
  aiChatOpen,
  dilemma,
  quiz,
  quizAnswered,
  endgame,
  showSummary,
  companyName,
  avatar,
  avatarOptions,
  theme: currentTheme,
  pendingCompanyName,
  aiPartnerData,
  aiInput,
  aiResponse,
  returns,
  badges,
  onModalClose,
  onCompanyNameChange,
  onAvatarChange,
  onThemeChange,
  onPendingCompanyNameChange,
  onDilemmaClose,
  onDilemmaAnswer,
  onQuizAnswer,
  onQuizClose,
  onEndgameClose,
  onSummaryClose,
  onAiInputChange,
  onAiAsk,
  onAiChatClose,
  onResetGame
}) => {
  const [dilemmaResult, setDilemmaResult] = useState<string | null>(null);

  useEffect(() => {
    setDilemmaResult(null);
  }, [dilemma]);

  return (
    <>
      {/* Company/Avatar Customization Modal */}
      {showModal && modalContent === 'edit' && (
        <ModalOverlay>
          <ModalContent $variant="edit">
            <ModalCloseButton 
              $color={theme.colors.cyber.accent} 
              onClick={onModalClose}
            >
              ×
            </ModalCloseButton>
            <ModalTitle $color={theme.colors.cyber.accent}>
              {companyName ? '编辑公司信息' : '注册公司'}
            </ModalTitle>
            <FormLabel>公司名称：</FormLabel>
            <FormInput 
              type="text" 
              value={pendingCompanyName} 
              onChange={e => onPendingCompanyNameChange(e.target.value)} 
              autoFocus 
            />
            <FormLabel>选择头像：</FormLabel>
            <AvatarOptions>
              {avatarOptions.map(url => (
                <AvatarOption 
                  key={url} 
                  src={url} 
                  alt="avatar" 
                  $selected={avatar === url}
                  onClick={() => onAvatarChange(url)} 
                />
              ))}
            </AvatarOptions>
            <FormLabel>主题风格：</FormLabel>
            <FormSelect 
              value={currentTheme} 
              onChange={e => onThemeChange(e.target.value)}
            >
              <option value="cyberpunk">赛博朋克</option>
              <option value="classic">经典</option>
              <option value="meme">搞笑</option>
            </FormSelect>
            <ModalButton $variant="primary" onClick={onModalClose}>
              取消
            </ModalButton>
            {companyName ? (
              <ModalButton 
                $variant="secondary" 
                onClick={() => { 
                  onCompanyNameChange(pendingCompanyName); 
                  onModalClose(); 
                }}
              >
                保存
              </ModalButton>
            ) : (
              <ModalButton 
                $variant="secondary" 
                onClick={() => { 
                  onCompanyNameChange(pendingCompanyName); 
                  onModalClose(); 
                }}
              >
                注册
              </ModalButton>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {/* AI Chat Modal */}
      {aiChatOpen && (
        <ModalOverlay>
          <ModalContent $variant="ai">
            <ModalCloseButton 
              $color={theme.colors.cyber.secondary} 
              onClick={onAiChatClose}
            >
              ×
            </ModalCloseButton>
            <AiPartnerHeader>
              <AiPartnerAvatar 
                src={aiPartnerData.avatar} 
                alt="AI Partner" 
              />
              <AiPartnerName>{aiPartnerData.name}</AiPartnerName>
            </AiPartnerHeader>
            <AiDescription>
              你可以向AI伙伴提问任何金融相关问题。
            </AiDescription>
            <AiInput 
              type="text" 
              value={aiInput} 
              onChange={e => onAiInputChange(e.target.value)} 
              placeholder="请输入你的问题..." 
            />
            <ModalButton $variant="primary" onClick={onAiAsk}>
              发送
            </ModalButton>
            {aiResponse && (
              <AiResponse>
                {aiResponse}
              </AiResponse>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Dilemma Modal */}
      {dilemma && (
        <ModalOverlay>
          <ModalContent $variant="dilemma">
            <ModalTitle $color={theme.colors.cyber.secondary}>决策时刻</ModalTitle>
            <DilemmaText>{dilemma.text}</DilemmaText>
            {dilemmaResult ? (
              <>
                <DilemmaText>{dilemmaResult}</DilemmaText>
                <ModalButton $variant="primary" onClick={onDilemmaClose}>
                  继续
                </ModalButton>
              </>
            ) : (
              <DilemmaOptions>
                {dilemma.options.map((opt, idx) => (
                  <ModalButton
                    $variant="primary"
                    key={idx}
                    onClick={() => {
                      const res = onDilemmaAnswer(idx);
                      setDilemmaResult(res);
                    }}
                  >
                    {opt.text}
                  </ModalButton>
                ))}
              </DilemmaOptions>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Quiz Modal */}
      {quiz && (
        <ModalOverlay>
          <ModalContent $variant="quiz">
            <ModalTitle $color={theme.colors.cyber.primary}>金融知识小测验</ModalTitle>
            <QuizQuestion>{quiz.question}</QuizQuestion>
            <QuizOptions>
              {quiz.options.map((opt: string) => (
                <ModalButton 
                  $variant="primary" 
                  key={opt} 
                  onClick={() => onQuizAnswer(opt)}
                >
                  {opt}
                </ModalButton>
              ))}
            </QuizOptions>
            {quizAnswered && (
              <QuizResult $correct={quizAnswered === quiz.answer}>
                {quizAnswered === quiz.answer ? '回答正确！获得知识大师徽章！' : '回答错误，再接再厉！'}
              </QuizResult>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Endgame Modal */}
      {endgame && !showSummary && (
        <EndgameOverlay>
          <EndgameImage 
            src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" 
            alt="victory" 
          />
          <EndgameTitle>
            传奇空岛重启成功！
          </EndgameTitle>
          <EndgameDescription>
            你已收集全部神器徽章，财富目标达成，成功渡过终极经济风暴！
          </EndgameDescription>
        </EndgameOverlay>
      )}

      {/* Summary Modal */}
      {showSummary && (
        <SummaryOverlay>
          <SummaryTitle>冒险总结</SummaryTitle>
          <SummaryContent>
            <SummaryItem>累计收益：{returns}%</SummaryItem>
            <SummaryItem>获得徽章：{badges.join('、')}</SummaryItem>
            <SummaryItem>教育收获：分散投资、长期主义、风险管理、冷静应对市场波动</SummaryItem>
          </SummaryContent>
          <ModalButton $variant="primary" onClick={onSummaryClose}>
            再玩一次
          </ModalButton>
        </SummaryOverlay>
      )}

      {/* General Modal */}
      {showModal && modalContent !== 'edit' && (
        <ModalOverlay onClick={onModalClose}>
          <ModalContent $variant="general">
            <ModalCloseButton 
              $color={theme.colors.cyber.secondary} 
              onClick={onModalClose}
            >
              ×
            </ModalCloseButton>
            <GeneralModalContent>{modalContent}</GeneralModalContent>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};
