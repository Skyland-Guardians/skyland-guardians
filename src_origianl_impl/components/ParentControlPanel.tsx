import React, { useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ParentReport } from './ParentReport';
import { exportReport } from '../utils/report';
import type { GameHistory } from '../types';

interface ParentControlPanelProps {
  pendingRequest: number | null;
  allowedAssets: string[];
  aiEnabled: boolean;
  aiPersonality: string;
  aiPersonalities: { id: string; name: string; riskTolerance: 'low' | 'medium' | 'high' }[];
  history: GameHistory[];
  badges: string[];
  aiNote?: string;
  onApprove: () => void;
  onReject: () => void;
  onToggleAsset: (asset: string) => void;
  onToggleAi: (enabled: boolean) => void;
  onPersonalityChange: (id: string) => void;
  onClose: () => void;
}

const Overlay = styled.div`
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

const Panel = styled.div`
  background: ${theme.colors.cyber.dark};
  color: ${theme.colors.cyber.text};
  border-radius: 16px;
  padding: 24px;
  min-width: 320px;
  max-width: 480px;
  box-shadow: 0 0 32px ${theme.colors.cyber.secondary}bb;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 12px;
  right: 18px;
  font-size: 22px;
  cursor: pointer;
  color: ${theme.colors.cyber.secondary};
`;

const AssetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AssetLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Select = styled.select`
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid ${theme.colors.cyber.accent};
  background: ${theme.colors.cyber.dark};
  color: ${theme.colors.cyber.text};
`;

export const ParentControlPanel: React.FC<ParentControlPanelProps> = ({
  pendingRequest,
  allowedAssets,
  aiEnabled,
  aiPersonality,
  aiPersonalities,
  history,
  badges,
  aiNote,
  onApprove,
  onReject,
  onToggleAsset,
  onToggleAi,
  onPersonalityChange,
  onClose
}) => {
  const assets = [
    { key: 'tech', label: '科技' },
    { key: 'bond', label: '债券' },
    { key: 'gold', label: '黄金' },
    { key: 'crypto', label: '加密' },
    { key: 'esg', label: 'ESG' },
    { key: 'stablecoin', label: '稳定币' },
    { key: 'yield', label: '收益' }
  ];

  const riskMap: Record<'low' | 'medium' | 'high', string> = {
    low: '稳健',
    medium: '平衡',
    high: '进取'
  };

  const reportRef = useRef<HTMLDivElement>(null);

  return (
    <Overlay>
      <Panel>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h3>家长控制</h3>
        {pendingRequest !== null && (
          <div>
            <p>孩子申请 {pendingRequest} 探险币</p>
            <button className="legacy-btn" onClick={onApprove}>批准</button>
            <button className="legacy-btn" onClick={onReject}>拒绝</button>
          </div>
        )}
        <div>
          <h4>资产白名单</h4>
          <AssetsList>
            {assets.map(a => (
              <AssetLabel key={a.key}>
                <input
                  type="checkbox"
                  checked={allowedAssets.includes(a.key)}
                  onChange={() => onToggleAsset(a.key)}
                />
                {a.label}
              </AssetLabel>
            ))}
          </AssetsList>
        </div>

        <div>
          <h4>AI 设置</h4>
          <AssetsList>
            <AssetLabel>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={e => onToggleAi(e.target.checked)}
              />
              启用AI聊天
            </AssetLabel>
            <Select
              value={aiPersonality}
              onChange={e => onPersonalityChange(e.target.value)}
            >
              {aiPersonalities.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}（{riskMap[p.riskTolerance]}）
                </option>
              ))}
            </Select>
          </AssetsList>
        </div>

        <div>
          <h4>报告</h4>
          <ParentReport ref={reportRef} history={history} badges={badges} allowedAssets={allowedAssets} aiNote={aiNote} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button className="legacy-btn" onClick={() => reportRef.current && exportReport(reportRef.current, 'pdf')}>下载PDF</button>
            <button className="legacy-btn" onClick={() => reportRef.current && exportReport(reportRef.current, 'png')}>下载PNG</button>
          </div>
        </div>
      </Panel>
    </Overlay>
  );
};
