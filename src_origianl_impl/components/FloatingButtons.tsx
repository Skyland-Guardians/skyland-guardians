import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface FloatingButtonsProps {
  wheelOpen: boolean;
  wheelResult: string | null;
  wheelUsed: boolean;
  aiChatOpen: boolean;
  aiEnabled: boolean;
  onWheelOpen: () => void;
  onWheelClose: () => void;
  onSpinWheel: () => void;
  onAiChatOpen: () => void;
  onAiChatClose: () => void;
  onParentOpen: () => void;
}

// Styled Components
const FloatingButton = styled.button<{ $type: 'wheel' | 'chat' | 'parent'; $disabled?: boolean }>`
  position: fixed;
  bottom: ${({ $type }) =>
    $type === 'parent' ? '188px' : $type === 'wheel' ? '110px' : '32px'
  };
  right: 32px;
  z-index: 1000;
  background: ${({ $type }) =>
    $type === 'chat' ? theme.colors.cyber.primary : theme.colors.cyber.secondary
  };
  color: ${({ $type }) =>
    $type === 'chat' ? theme.colors.cyber.dark : theme.colors.cyber.text
  };
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 28px;
  font-weight: 900;
  box-shadow: 0 0 16px ${({ $type }) => 
    $type === 'wheel' ? `${theme.colors.cyber.secondary}bb` : `${theme.colors.cyber.primary}cc`
  };
  border: none;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  transition: all ${theme.transitions.normal};

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 0 20px ${({ $type }) => 
      $type === 'wheel' ? theme.colors.cyber.secondary : theme.colors.cyber.primary
    };
  }
`;

const WheelModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WheelModalContent = styled.div`
  background: ${theme.colors.cyber.dark};
  color: ${theme.colors.cyber.text};
  border-radius: 16px;
  padding: 32px;
  min-width: 320px;
  max-width: 480px;
  box-shadow: 0 0 32px ${theme.colors.cyber.secondary}bb;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 12px;
  right: 18px;
  font-size: 22px;
  cursor: pointer;
  color: ${theme.colors.cyber.secondary};
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.cyber.primary};
  }
`;

const ModalTitle = styled.h2`
  color: ${theme.colors.cyber.secondary};
  margin-bottom: 16px;
`;

const ModalDescription = styled.div`
  font-size: 18px;
  margin-bottom: 24px;
  text-align: center;
`;

const SpinButton = styled.button`
  font-size: 22px;
  padding: 0.7rem 2.5rem;
  margin-bottom: 12px;
  transition: all ${theme.transitions.fast};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const WheelResult = styled.div`
  margin-top: 18px;
  color: ${theme.colors.cyber.text};
  font-weight: 700;
  font-size: 20px;
  text-shadow: 0 0 8px ${theme.colors.cyber.secondary};
`;

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  wheelOpen,
  wheelResult,
  wheelUsed,
  aiChatOpen,
  aiEnabled,
  onWheelOpen,
  onWheelClose,
  onSpinWheel,
  onAiChatOpen,
  onAiChatClose,
  onParentOpen
}) => {
  return (
    <>
      {/* Spin the Wheel Floating Button */}
      <FloatingButton 
        $type="wheel"
        $disabled={wheelUsed}
        onClick={() => !wheelUsed && onWheelOpen()} 
        title="每日转盘" 
        disabled={wheelUsed}
      >
        🎡
      </FloatingButton>

      {/* AI Chat Floating Button */}
      {aiEnabled && (
        <FloatingButton
          $type="chat"
          onClick={onAiChatOpen}
          title="向AI伙伴提问"
        >
          💬
        </FloatingButton>
      )}

      {/* Parent Control Floating Button */}
      <FloatingButton
        $type="parent"
        onClick={onParentOpen}
        title="家长控制"
      >
        👪
      </FloatingButton>

      {/* Spin the Wheel Modal */}
      {wheelOpen && (
        <WheelModalOverlay>
          <WheelModalContent>
            <CloseButton onClick={onWheelClose}>×</CloseButton>
            <ModalTitle>每日转盘</ModalTitle>
            <ModalDescription>
              点击转盘，获得随机奖励或惩罚！每天限一次。
            </ModalDescription>
            <SpinButton 
              className="legacy-btn" 
              onClick={onSpinWheel} 
              disabled={wheelResult !== null}
            >
              🎡 Spin!
            </SpinButton>
            {wheelResult && (
              <WheelResult>
                {wheelResult}
              </WheelResult>
            )}
          </WheelModalContent>
        </WheelModalOverlay>
      )}
    </>
  );
};
