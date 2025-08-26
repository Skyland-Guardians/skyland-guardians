import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import type { GameHistory } from '../types';

interface ParentReportProps {
  history: GameHistory[];
  badges: string[];
  allowedAssets: string[];
  aiNote?: string;
}

const ReportContainer = styled.div`
  background: ${theme.colors.cyber.dark};
  color: ${theme.colors.cyber.text};
  border: 1px solid ${theme.colors.cyber.accent};
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
`;

export const ParentReport = React.forwardRef<HTMLDivElement, ParentReportProps>(({
  history,
  badges,
  allowedAssets,
  aiNote
}, ref) => {
  if (history.length === 0) {
    return <ReportContainer ref={ref}>暂无数据</ReportContainer>;
  }

  const last = history[history.length - 1];
  const diversification = allowedAssets.map(key => ({ key, weight: last.weights[key] || 0 }));
  const disallowed = Object.keys(last.weights).filter(k => !allowedAssets.includes(k) && (last.weights[k] || 0) > 0);

  const returns = history.map(h => h.returns);
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance = returns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);

  return (
    <ReportContainer ref={ref} id="parent-report">
      <h4>分散配置</h4>
      <ul>
        {diversification.map(d => (
          <li key={d.key}>{d.key}: {d.weight}%</li>
        ))}
      </ul>
      {disallowed.length > 0 && (
        <p>⚠️ 使用了未允许资产：{disallowed.join('、')}</p>
      )}
      <h4>波动率</h4>
      <p>{volatility.toFixed(2)}</p>
      <h4>成就</h4>
      {badges.length > 0 ? (
        <ul>
          {badges.map(b => (<li key={b}>{b}</li>))}
        </ul>
      ) : <p>暂无</p>}
      {aiNote && (
        <>
          <h4>AI 伙伴提示</h4>
          <p>{aiNote}</p>
        </>
      )}
    </ReportContainer>
  );
});
