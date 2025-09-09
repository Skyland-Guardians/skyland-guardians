
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { LeaderboardEntry } from './LeaderboardEntry';
import './Leaderboard.css';
import { updateLeaderboard } from './updateLeaderboard';
import { achievements } from '../../data/achievements';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_KEY = 'skyland_leaderboard';

function getLeaderboard(): LeaderboardEntry[] {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [detailOpenIdx, setDetailOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEntries(getLeaderboard());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const achievementMap = Object.fromEntries(achievements.map(a => [a.id, a]));
  const allAchievementIds = [...achievements].sort((a, b) => b.starRating - a.starRating).map(a => a.id);

  function getProgress(entry: LeaderboardEntry) {
    const uniqueAchIds = Array.from(new Set(entry.achievements));
    return Math.round((uniqueAchIds.length / allAchievementIds.length) * 100);
  }

  const modal = (
    <div className="my-cards-overlay leaderboard-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="my-cards-modal leaderboard-modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="my-cards-header">
          <h3 className="my-cards-title">🏆 Leaderboard</h3>
          <button className="my-cards-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="my-cards-content">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Nickname</th>
                <th>Stars</th>
                <th>Progress</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '16px', color: '#aaa' }}>No records yet.</td></tr>
              ) : entries.map((entry, i) => (
                <tr key={entry.nickname} className={i === 0 ? 'leaderboard-top' : ''}>
                  <td>{i + 1}</td>
                  <td>{entry.nickname}</td>
                  <td>{entry.stars}</td>
                  <td>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${getProgress(entry)}%` }} />
                    </div>
                    <span className="progress-label">{getProgress(entry)}%</span>
                  </td>
                  <td>
                    <button className="details-btn" onClick={() => setDetailOpenIdx(i)}>
                      <span role="img" aria-label="View Details">🔍</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 成就详情弹窗 */}
          {detailOpenIdx !== null && entries[detailOpenIdx] && (
            <div className="achievement-detail-overlay" onClick={() => setDetailOpenIdx(null)}>
              <div
                className="achievement-detail-modal"
                style={{ maxWidth: 320, width: '92%', padding: '10px 8px', fontSize: '0.85em' }}
                onClick={e => e.stopPropagation()}
              >
                <div className="detail-header" style={{ marginBottom: 6 }}>
                  <h4 style={{ fontSize: '1em', margin: 0 }}>{entries[detailOpenIdx].nickname} Achievements</h4>
                  <button className="my-cards-close" onClick={() => setDetailOpenIdx(null)} aria-label="Close">×</button>
                </div>
                <div className="detail-content">
                  <div className="achievements-list">
                    {allAchievementIds.map(aid => {
                      const ach = achievementMap[aid];
                      const achieved = entries[detailOpenIdx].achievements.includes(aid);
                      return (
                        <div
                          key={aid}
                          className={`achievement-item${achieved ? ' achieved' : ' not-achieved'}`}
                          style={{ padding: '4px 0', fontSize: '0.85em' }}
                        >
                          <img
                            src={ach.badgeIcon}
                            alt={ach.name}
                            className="achievement-icon"
                            style={{ width: 24, height: 24, marginRight: 6, filter: achieved ? 'none' : 'grayscale(1) opacity(0.5)' }}
                          />
                          <div className="achievement-info">
                            <div className="achievement-title" style={{ color: achieved ? '#fff' : '#aaa', fontSize: '0.95em' }}>{ach.name}</div>
                            <div className="achievement-desc" style={{ color: achieved ? '#ddd' : '#888', fontSize: '0.85em' }}>{ach.description}</div>
                          </div>
                          <div className="achievement-grade" style={{ color: achieved ? '#ffd700' : '#666', fontSize: '0.85em', marginLeft: 4 }}>{ach.starRating}★</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default LeaderboardModal;
