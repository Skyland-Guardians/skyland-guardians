import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import type { AIPartner } from '../types';

interface SidebarProps {
  aiPartnerData: AIPartner;
  badgesData: any[];
  badges: string[];
  history: any[];
  stars: number;
  onBadgeClick: (badge: any) => void;
}

// Styled Components
const SidebarContainer = styled.div`
  flex: 0.7;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: rgba(30,30,60,0.95);
  border-radius: 12px;
  box-shadow: 0 0 16px ${theme.colors.cyber.secondary}55;
  padding: 1rem;
`;

const Section = styled.div`
  /* 基础样式 */
`;

const SectionTitle = styled.h2<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-size: 1.1rem;
  margin-bottom: 8px;
`;

const AiPartnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AiPartnerAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 0 0 8px ${theme.colors.cyber.primary};
`;

const AiPartnerName = styled.span`
  color: ${theme.colors.cyber.text};
  font-weight: 700;
`;

const AiPartnerDescription = styled.div`
  color: ${theme.colors.cyber.text};
  font-size: 0.95rem;
  margin-top: 8px;
`;

const BadgesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const BadgeItem = styled.span`
  cursor: pointer;
  transition: transform ${theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`;

export const Sidebar: React.FC<SidebarProps> = ({
  aiPartnerData,
  badgesData,
  badges,
  history,
  stars,
  onBadgeClick
}) => {
  return (
    <SidebarContainer>
      {/* AI Partner Section */}
      <Section>
        <SectionTitle $color={theme.colors.cyber.primary}>AI 伙伴</SectionTitle>
        <AiPartnerInfo>
          <AiPartnerAvatar 
            src={aiPartnerData.avatar} 
            alt="AI Partner" 
          />
          <AiPartnerName>{aiPartnerData.name}</AiPartnerName>
        </AiPartnerInfo>
        <AiPartnerDescription>
          {(() => {
            if (history.length === 0) return '欢迎来到空岛守护者，分散配置，理性投资！';
            const last = history[history.length - 1];
            if (last.returns < 0) return aiPartnerData.feedbackTemplates[4];
            if (badges.length > 0) return aiPartnerData.feedbackTemplates[5].replace('{badge}', badges[badges.length - 1]);
            return aiPartnerData.feedbackTemplates[0].replace('{asset}', '资产').replace('{percent}', '分散');
          })()}
        </AiPartnerDescription>
      </Section>

      {/* Stars Section */}
      <Section>
        <SectionTitle $color={theme.colors.meme.accent}>守护之星</SectionTitle>
        <div style={{ color: theme.colors.cyber.text, fontWeight: 700 }}>⭐ {stars}</div>
      </Section>

      {/* Badges Section */}
      <Section>
        <SectionTitle $color={theme.colors.cyber.accent}>成就徽章</SectionTitle>
        <BadgesGrid>
          {badgesData.map(badgeObj => (
            <BadgeItem 
              key={badgeObj.key} 
              className={`legacy-badge${badges.includes(badgeObj.name.replace('徽章','')) ? '' : ' locked'}`}
              title={badgeObj.desc} 
              onClick={() => onBadgeClick(badgeObj)} 
            >
              {badgeObj.name} {badges.includes(badgeObj.name.replace('徽章','')) ? '✔️' : ''}
            </BadgeItem>
          ))}
        </BadgesGrid>
      </Section>
    </SidebarContainer>
  );
};
