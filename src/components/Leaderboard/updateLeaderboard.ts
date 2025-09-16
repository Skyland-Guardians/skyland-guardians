import type { LeaderboardEntry } from './LeaderboardEntry';

const LOCAL_KEY = 'skyland_leaderboard';

export function updateLeaderboard(entry: LeaderboardEntry) {
  const raw = localStorage.getItem(LOCAL_KEY);
  let leaderboard: LeaderboardEntry[] = [];
  if (raw) {
    try {
      leaderboard = JSON.parse(raw);
    } catch {}
  }
  const idx = leaderboard.findIndex(e => e.nickname === entry.nickname);
  if (idx >= 0) {
    leaderboard[idx] = entry;
  } else {
    leaderboard.push(entry);
  }
  leaderboard.sort((a, b) => b.stars - a.stars);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(leaderboard));
}
