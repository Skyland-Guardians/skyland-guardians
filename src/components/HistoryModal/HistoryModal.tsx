import { GAME_ASSETS } from '../../data/game-assets';
import { createPortal } from 'react-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './HistoryModal.css';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  performanceHistory: {
    day: number;
    portfolioReturn: number;
    totalValue: number;
    assetReturns: Record<string, number>;
  }[];
  currentDay: number;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, performanceHistory }) => {
  if (!isOpen) return null;

  console.log('HistoryModal - performanceHistory:', performanceHistory);

  // 检查数据有效性
  if (!performanceHistory || performanceHistory.length === 0) {
    console.log('HistoryModal - No performance history data');
    return createPortal(
      <div className="history-modal-overlay">
        <div className="history-modal">
          <div className="history-modal-header">
            <h2 className="history-modal-title">
              <span style={{ fontSize: '1.8rem' }}>📈</span>
              Asset Performance History
            </h2>
            <button onClick={onClose} className="history-modal-close">×</button>
          </div>
          <div className="history-modal-content">
            <div className="no-data-message">
              No historical data available. Please perform investment operations for a few days first.
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // 获取最近15天的数据用于显示
  const recentHistory = performanceHistory.slice(-15);
  console.log('HistoryModal - recentHistory:', recentHistory);
  
  // 准备图表数据
  let chartData: any[] = [];
  try {
    chartData = recentHistory.map((dayData, index) => {
      console.log(`Processing day ${index}:`, dayData);
      
      // 简化处理：直接使用当日收益率而不是累计收益率
      const dataPoint: any = {
        day: `Day ${dayData.day}`,
        Portfolio: (dayData.portfolioReturn * 100).toFixed(2)
      };
      
      // 添加各资产的收益率
      GAME_ASSETS.forEach(asset => {
        const dailyReturn = dayData.assetReturns?.[asset.id] || 0;
        dataPoint[asset.shortName || asset.gameName] = (dailyReturn * 100).toFixed(2);
      });
      
      return dataPoint;
    });
    console.log('HistoryModal - chartData:', chartData);
  } catch (error) {
    console.error('Error processing chart data:', error);
    chartData = [];
  }

  // 资产颜色配置
  const colors = [
    '#3b82f6', // Portfolio - 蓝色
    '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899'
  ];

  const modal = (
    <div className="history-modal-overlay">
      <div className="history-modal">
        {/* Header */}
        <div className="history-modal-header">
          <h2 className="history-modal-title">
            <span style={{ fontSize: '1.8rem' }}>📈</span>
            Asset Performance History
          </h2>
          <button
            onClick={onClose}
            className="history-modal-close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="history-modal-content">
          {/* Chart */}
          <div className="chart-section">
            <h3 className="chart-title">
              Cumulative Returns - Last {recentHistory.length} Days (%)
            </h3>
            
            {recentHistory.length > 0 ? (
              <div className="chart-container" style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a4a6a" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#ddd"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#ddd"
                      fontSize={12}
                      label={{ value: 'Return (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#ddd' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#2a2a3e', 
                        border: '1px solid #4a4a6a',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [`${value}%`, '']}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#ddd' }}
                    />
                    
                    {/* Portfolio line - thicker */}
                    <Line 
                      type="monotone" 
                      dataKey="Portfolio" 
                      stroke={colors[0]}
                      strokeWidth={3}
                      dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
                    />
                    
                    {/* Asset lines */}
                    {GAME_ASSETS.map((asset, index) => (
                      <Line 
                        key={asset.id}
                        type="monotone" 
                        dataKey={asset.shortName || asset.gameName}
                        stroke={colors[index + 1]}
                        strokeWidth={2}
                        dot={{ fill: colors[index + 1], strokeWidth: 1, r: 3 }}
                        activeDot={{ r: 5, stroke: colors[index + 1], strokeWidth: 1 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="no-data-message">
                No historical data available. Please perform investment operations for a few days first.
              </div>
            )}
          </div>

          {/* Summary stats */}
          {recentHistory.length > 0 && (
            <div className="summary-section">
              <h4 className="summary-title">Performance Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Total Return</span>
                  <div className={`summary-value ${(chartData[chartData.length - 1]?.Portfolio || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {chartData[chartData.length - 1]?.Portfolio || '0.00'}%
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Current Value</span>
                  <div className="summary-value neutral">
                    {recentHistory[recentHistory.length - 1]?.totalValue?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Trading Days</span>
                  <div className="summary-value neutral">
                    {recentHistory.length} Days
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal into document.body to escape layout stacking context
  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body);
  }

  return modal;
}

export default HistoryModal;