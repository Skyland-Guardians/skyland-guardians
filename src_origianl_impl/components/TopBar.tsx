import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { GAME_CONFIG } from '../constants/game-config';

interface TopBarProps {
  companyName: string;
  avatar: string;
  day: number;
  coins: number;
  gems: number;
  stars: number;
  theme: string;
  onEditCompany: () => void;
  onRequestCoins: () => void;
}

// Styled Components
const EditButton = styled.button`
  position: fixed;
  top: 32px;
  right: 32px;
  z-index: 1000;
  background: ${theme.colors.meme.primary};
  color: ${theme.colors.meme.text};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 28px;
  font-weight: 900;
  box-shadow: 0 0 16px ${theme.colors.meme.primary}cc;
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.normal};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px ${theme.colors.meme.primary};
  }
`;

const TopBarContainer = styled.div<{ $theme: string }>`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ $theme }) => 
    $theme === 'cyberpunk' ? theme.colors.cyber.bg :
    $theme === 'classic' ? theme.colors.classic.bg :
    theme.colors.meme.primary
  };
  border-bottom: 2px solid ${theme.colors.cyber.primary};
  padding: 0.8rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CompanyAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 8px ${theme.colors.cyber.accent};
`;

const CompanyName = styled.span<{ $theme: string }>`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${({ $theme }) => 
    $theme === 'cyberpunk' ? theme.colors.cyber.primary :
    $theme === 'classic' ? theme.colors.classic.text :
    theme.colors.meme.accent
  };
`;

const StatusInfo = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${theme.colors.cyber.primary};
`;

const StatusInfoSecondary = styled(StatusInfo)`
  color: ${theme.colors.cyber.secondary};
`;

const StatusInfoText = styled(StatusInfo)`
  color: ${theme.colors.cyber.text};
`;

const ResourcesContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ResourceBadge = styled.span<{ $type: 'coins' | 'gems' }>`
  background: ${({ $type }) => 
    $type === 'coins' ? theme.colors.meme.primary : theme.colors.cyber.secondary
  };
  color: ${({ $type }) => 
    $type === 'coins' ? theme.colors.meme.text : theme.colors.cyber.text
  };
  border-radius: 8px;
  padding: 0.3em 1em;
  font-weight: 700;
  transition: transform ${theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`;

const RequestButton = styled.button`
  background: ${theme.colors.cyber.primary};
  color: ${theme.colors.cyber.dark};
  border-radius: 8px;
  padding: 0.3em 0.6em;
  font-weight: 700;
  cursor: pointer;
`;

export const TopBar: React.FC<TopBarProps> = ({
  companyName,
  avatar,
  day,
  coins,
  gems,
  stars,
  theme: currentTheme,
  onEditCompany,
  onRequestCoins
}) => {
  return (
    <>
      {/* Company/Avatar Customization Modal Button */}
      <EditButton onClick={onEditCompany} title="编辑公司信息">
        ⚙️
      </EditButton>

      {/* Sticky Top Bar with Company/Avatar/Resources */}
      <TopBarContainer $theme={currentTheme}>
        <CompanyInfo>
          <CompanyAvatar src={avatar} alt="avatar" />
          <CompanyName $theme={currentTheme}>
            {companyName}
          </CompanyName>
        </CompanyInfo>
        
        <StatusInfo>
          星星：{stars}
        </StatusInfo>
        
        <StatusInfoSecondary>
          财富目标：{GAME_CONFIG.WEALTH_GOAL}%
        </StatusInfoSecondary>
        
        <StatusInfoText>
          第 {day + 1} 天
        </StatusInfoText>
        
        <ResourcesContainer>
          <ResourceBadge $type="coins">
            💰 {coins}
          </ResourceBadge>
          <ResourceBadge $type="gems">
            💎 {gems}
          </ResourceBadge>
          <RequestButton onClick={onRequestCoins}>请求20💰</RequestButton>
        </ResourcesContainer>
      </TopBarContainer>
    </>
  );
};
