import { useState } from 'react';
import { useGameState } from '../../hooks/useGameContext';

export function ParentDashboard() {
  const { guardianSettings, updateGuardianSettings, exitGuardianMode } = useGameState();
  const [budget, setBudget] = useState<number>(guardianSettings?.budget || 0);
  const [whitelist, setWhitelist] = useState<string>(guardianSettings?.whitelist.join(',') || '');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>(guardianSettings?.riskLevel || 'high');

  const saveSettings = () => {
    updateGuardianSettings?.({
      budget: budget,
      whitelist: whitelist.split(',').map(w => w.trim()).filter(Boolean),
      riskLevel: riskLevel,
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Parent Dashboard</h2>
      <div>
        <label>
          Budget:
          <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} />
        </label>
      </div>
      <div>
        <label>
          Whitelist (comma separated ids):
          <input value={whitelist} onChange={e => setWhitelist(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Risk Level:
          <select value={riskLevel} onChange={e => setRiskLevel(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <button onClick={saveSettings}>Save</button>
      <button onClick={exitGuardianMode}>Exit</button>
    </div>
  );
}
