import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { RealWorldAssetMapping, MoneyRequest, LoanStatus } from '../../types/parent-control';
import { REAL_WORLD_ASSET_OPTIONS } from '../../types/parent-control';
import { GAME_ASSETS } from '../../data/game-assets';

interface ParentControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ParentControlPanel({ isOpen, onClose }: ParentControlPanelProps) {
  // Initialize with default mappings directly from GAME_ASSETS
  const getDefaultMappings = (): RealWorldAssetMapping[] => {
    return GAME_ASSETS.map(asset => {
      // Extract suggested real-world assets from the asset's realWorld description
      let suggestedAssets = [];
      if (asset.realWorld.includes('QQQ')) suggestedAssets.push('QQQ');
      if (asset.realWorld.includes('BTC')) suggestedAssets.push('BTC');
      if (asset.realWorld.includes('ETH')) suggestedAssets.push('ETH');
      if (asset.realWorld.includes('GLD')) suggestedAssets.push('GLD');
      if (asset.realWorld.includes('TLT')) suggestedAssets.push('TLT');
      if (asset.realWorld.includes('USDC')) suggestedAssets.push('USDC');
      
      // If no specific assets found, use category-based defaults
      if (suggestedAssets.length === 0) {
        switch (asset.risk) {
          case 'high':
            suggestedAssets = asset.id === 'crystal' ? ['BTC', 'ETH'] : ['QQQ', 'VGT'];
            break;
          case 'medium':
            suggestedAssets = asset.id === 'forest' ? ['ESGU'] : ['VTI'];
            break;
          case 'low':
            suggestedAssets = asset.id === 'golden' ? ['GLD'] : asset.id === 'shield' ? ['TLT'] : ['USDC'];
            break;
        }
      }
      
      return {
          gameAssetId: asset.id,
          realWorldAssets: suggestedAssets,
          maxAllocationPercentage: 100
        };
    });
  };

  const [assetMappings, setAssetMappings] = useState<RealWorldAssetMapping[]>(getDefaultMappings());
  const [moneyRequests, setMoneyRequests] = useState<MoneyRequest[]>([]);
  const [activeLoans, setActiveLoans] = useState<LoanStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'assets' | 'requests' | 'loans'>('assets');

  // Load data from localStorage and refresh on open
  useEffect(() => {
    const loadData = () => {
      const savedMappings = localStorage.getItem('parentControl_assetMappings');
      const savedRequests = localStorage.getItem('parentControl_moneyRequests');
      const savedLoans = localStorage.getItem('parentControl_activeLoans');

      if (savedMappings) {
        setAssetMappings(JSON.parse(savedMappings));
      } else {
        // Initialize with default mappings from game assets
        const defaultMappings = GAME_ASSETS.map(asset => {
          // Extract suggested real-world assets from the asset's realWorld description
          let suggestedAssets = [];
          if (asset.realWorld.includes('QQQ')) suggestedAssets.push('QQQ');
          if (asset.realWorld.includes('BTC')) suggestedAssets.push('BTC');
          if (asset.realWorld.includes('ETH')) suggestedAssets.push('ETH');
          if (asset.realWorld.includes('GLD')) suggestedAssets.push('GLD');
          if (asset.realWorld.includes('TLT')) suggestedAssets.push('TLT');
          if (asset.realWorld.includes('USDC')) suggestedAssets.push('USDC');
          
          // If no specific assets found, use category-based defaults
          if (suggestedAssets.length === 0) {
            switch (asset.risk) {
              case 'high':
                suggestedAssets = asset.id === 'crystal' ? ['BTC', 'ETH'] : ['QQQ', 'VGT'];
                break;
              case 'medium':
                suggestedAssets = asset.id === 'forest' ? ['ESGU'] : ['VTI'];
                break;
              case 'low':
                suggestedAssets = asset.id === 'golden' ? ['GLD'] : asset.id === 'shield' ? ['TLT'] : ['USDC'];
                break;
            }
          }
          
          return {
            gameAssetId: asset.id,
            realWorldAssets: suggestedAssets,
            maxAllocationPercentage: 100
          };
        });
        setAssetMappings(defaultMappings);
        localStorage.setItem('parentControl_assetMappings', JSON.stringify(defaultMappings));
      }

      if (savedRequests) {
        const requests = JSON.parse(savedRequests);
        // Convert date strings back to Date objects
        const processedRequests = requests.map((req: any) => ({
          ...req,
          requestedAt: new Date(req.requestedAt),
          parentResponse: req.parentResponse ? {
            ...req.parentResponse,
            approvedAt: new Date(req.parentResponse.approvedAt),
            dueDate: new Date(req.parentResponse.dueDate)
          } : undefined
        }));
        setMoneyRequests(processedRequests);
      }

      if (savedLoans) {
        const loans = JSON.parse(savedLoans);
        // Convert date strings back to Date objects
        const processedLoans = loans.map((loan: any) => ({
          ...loan,
          dueDate: new Date(loan.dueDate)
        }));
        setActiveLoans(processedLoans);
      }
    };
    
    // Load data immediately on mount
    loadData();
    
    // If panel is open, set up refresh interval
    if (isOpen) {
      const interval = setInterval(loadData, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem('parentControl_assetMappings', JSON.stringify(assetMappings));
    localStorage.setItem('parentControl_moneyRequests', JSON.stringify(moneyRequests));
    localStorage.setItem('parentControl_activeLoans', JSON.stringify(activeLoans));
  };

  const updateAssetMapping = (gameAssetId: string, updates: Partial<RealWorldAssetMapping>) => {
    setAssetMappings(prev => 
      prev.map(mapping => 
        mapping.gameAssetId === gameAssetId 
          ? { ...mapping, ...updates }
          : mapping
      )
    );
  };

  const handleApproveRequest = (requestId: string, interestRate: number, durationDays: number, approvedAmount: number) => {
    setMoneyRequests(prev => 
      prev.map(request => 
        request.id === requestId
          ? {
              ...request,
              status: 'approved' as const,
              parentResponse: {
                interestRate,
                durationDays,
                approvedAmount,
                approvedAt: new Date(),
                dueDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
              }
            }
          : request
      )
    );

    // Create a new loan
    const newLoan: LoanStatus = {
      id: `loan_${Date.now()}`,
      principal: approvedAmount,
      interestRate,
      totalOwed: approvedAmount * (1 + interestRate / 100),
      dueDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
      status: 'active'
    };
    setActiveLoans(prev => [...prev, newLoan]);
  };

  const handleRejectRequest = (requestId: string) => {
    setMoneyRequests(prev => 
      prev.map(request => 
        request.id === requestId
          ? { ...request, status: 'rejected' as const }
          : request
      )
    );
  };

  useEffect(() => {
    saveData();
  }, [assetMappings, moneyRequests, activeLoans, saveData]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'rgba(30, 30, 46, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '90vw',
          maxWidth: '800px',
          height: '80vh',
          background: 'linear-gradient(145deg, #23233e 0%, #181826 100%)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid rgba(74,74,106,0.3)',
          background: 'linear-gradient(145deg, #2a2a3e, #1e1e2e)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ 
              color: '#fff', 
              margin: 0, 
              fontSize: '1.5rem',
              fontWeight: '700' 
            }}>
              🛡️ Parent Control Panel
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#aaa',
              fontSize: '2rem',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(74,74,106,0.3)',
          background: '#1a1a2e'
        }}>
          {[
            { id: 'assets', label: '🏦 Asset Mapping', icon: '🏦' },
            { id: 'requests', label: '💰 Money Requests', icon: '💰' },
            { id: 'loans', label: '📊 Active Loans', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === tab.id ? '#2a2a3e' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? '#fff' : '#aaa',
                fontWeight: activeTab === tab.id ? '600' : '400',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid #4f46e5' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px'
        }}>
          {activeTab === 'assets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#fff', margin: '0' }}>Configure Real-World Asset Mappings</h3>
                <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  {assetMappings.length} assets configured
                </div>
              </div>
              
              {GAME_ASSETS.map(gameAsset => {
                // Find existing mapping or create default
                const existingMapping = assetMappings.find(m => m.gameAssetId === gameAsset.id);
                const mapping = existingMapping || {
                  gameAssetId: gameAsset.id,
                  realWorldAssets: gameAsset.id === 'crystal' ? ['BTC', 'ETH'] : 
                                  gameAsset.id === 'sword' ? ['QQQ', 'VGT'] :
                                  gameAsset.id === 'golden' ? ['GLD'] :
                                  gameAsset.id === 'shield' ? ['TLT'] :
                                  gameAsset.id === 'fountain' ? ['USDC'] : ['VTI'],
                  maxAllocationPercentage: 100
                };
                
                return (
                  <div
                    key={gameAsset.id}
                    style={{
                      background: '#2a2a3e',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(74,74,106,0.3)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <img 
                        src={gameAsset.icon} 
                        alt={gameAsset.gameName}
                        style={{ width: '40px', height: '40px', flexShrink: 0 }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#fff', margin: '0 0 4px 0' }}>
                          {gameAsset.gameName} ({gameAsset.shortName})
                        </h4>
                        <p style={{ color: '#10b981', margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: '600' }}>
                          {gameAsset.loreName}
                        </p>
                        <p style={{ color: '#ccc', margin: '0 0 8px 0', fontSize: '0.85rem' }}>
                          {gameAsset.description}
                        </p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                          <span style={{ color: '#f59e0b' }}>Expected Return: {(gameAsset.expectedReturn * 100).toFixed(1)}%</span>
                          <span style={{ color: '#ef4444' }}>Risk: {gameAsset.risk.toUpperCase()}</span>
                          <span style={{ color: '#8b5cf6' }}>Volatility: {(gameAsset.volatility * 100).toFixed(1)}%</span>
                        </div>
                        <p style={{ color: '#6b7280', margin: '8px 0 0 0', fontSize: '0.8rem', fontStyle: 'italic' }}>
                          Real-world mapping: {gameAsset.realWorld}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ color: '#ccc', display: 'block', marginBottom: '8px' }}>
                        Real-World Assets (select multiple):
                      </label>
                      <select
                        multiple
                        value={mapping.realWorldAssets}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                          updateAssetMapping(gameAsset.id, { realWorldAssets: selectedOptions });
                        }}
                        style={{
                          width: '100%',
                          height: '120px',
                          background: '#1a1a2e',
                          border: '1px solid rgba(74,74,106,0.5)',
                          borderRadius: '8px',
                          color: '#fff',
                          padding: '8px'
                        }}
                      >
                        {REAL_WORLD_ASSET_OPTIONS.map(option => (
                          <option key={option} value={option} style={{ padding: '4px' }}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ color: '#ccc', display: 'block', marginBottom: '8px' }}>
                        Maximum Allocation Percentage: {mapping.maxAllocationPercentage}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={mapping.maxAllocationPercentage}
                        onChange={(e) => {
                          updateAssetMapping(gameAsset.id, { maxAllocationPercentage: Number(e.target.value) });
                        }}
                        style={{
                          width: '100%',
                          background: '#1a1a2e'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'requests' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>Money Requests from Child</h3>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}>
                  <span style={{ background: '#f59e0b', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
                    Pending: {moneyRequests.filter(r => r.status === 'pending').length}
                  </span>
                  <span style={{ background: '#10b981', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
                    Approved: {moneyRequests.filter(r => r.status === 'approved').length}
                  </span>
                  <span style={{ background: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '12px' }}>
                    Rejected: {moneyRequests.filter(r => r.status === 'rejected').length}
                  </span>
                </div>
              </div>
              {moneyRequests.length === 0 ? (
                <div style={{ 
                  color: '#aaa', 
                  textAlign: 'center', 
                  padding: '40px',
                  background: '#2a2a3e',
                  borderRadius: '12px'
                }}>
                  No money requests yet
                </div>
              ) : (
                <>
                  {/* Pending Requests */}
                  {moneyRequests.filter(r => r.status === 'pending').length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#f59e0b', margin: '0 0 12px 0' }}>⏳ Pending Requests</h4>
                      {moneyRequests.filter(r => r.status === 'pending').map(request => (
                  <div
                    key={request.id}
                    style={{
                      background: '#2a2a3e',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(74,74,106,0.3)'
                    }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 8px 0' }}>
                        💰 ${request.amount.toLocaleString()}
                      </h4>
                      <p style={{ color: '#ccc', margin: '0 0 8px 0' }}>
                        <strong>Reason:</strong> {request.reason}
                      </p>
                      <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>
                        Requested: {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder="Interest Rate %"
                        style={{
                          background: '#1a1a2e',
                          border: '1px solid rgba(74,74,106,0.5)',
                          borderRadius: '6px',
                          color: '#fff',
                          padding: '8px',
                          width: '120px'
                        }}
                        id={`interest-${request.id}`}
                      />
                      <input
                        type="number"
                        placeholder="Duration (days)"
                        style={{
                          background: '#1a1a2e',
                          border: '1px solid rgba(74,74,106,0.5)',
                          borderRadius: '6px',
                          color: '#fff',
                          padding: '8px',
                          width: '120px'
                        }}
                        id={`duration-${request.id}`}
                      />
                      <input
                        type="number"
                        placeholder="Approved Amount"
                        defaultValue={request.amount}
                        style={{
                          background: '#1a1a2e',
                          border: '1px solid rgba(74,74,106,0.5)',
                          borderRadius: '6px',
                          color: '#fff',
                          padding: '8px',
                          width: '140px'
                        }}
                        id={`amount-${request.id}`}
                      />
                      <button
                        onClick={() => {
                          const interestEl = document.getElementById(`interest-${request.id}`) as HTMLInputElement;
                          const durationEl = document.getElementById(`duration-${request.id}`) as HTMLInputElement;
                          const amountEl = document.getElementById(`amount-${request.id}`) as HTMLInputElement;
                          
                          const interestRate = Number(interestEl.value) || 0;
                          const duration = Number(durationEl.value) || 30;
                          const amount = Number(amountEl.value) || request.amount;
                          
                          handleApproveRequest(request.id, interestRate, duration, amount);
                        }}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
                    </div>
                  )}
                  
                  {/* Processed Requests */}
                  {moneyRequests.filter(r => r.status !== 'pending').length > 0 && (
                    <div>
                      <h4 style={{ color: '#10b981', margin: '0 0 12px 0' }}>✅ Processed Requests</h4>
                      {moneyRequests.filter(r => r.status !== 'pending').map(request => (
                        <div
                          key={request.id}
                          style={{
                            background: '#2a2a3e',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid rgba(74,74,106,0.3)',
                            marginBottom: '8px',
                            opacity: 0.8
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h5 style={{ color: '#fff', margin: '0 0 4px 0' }}>
                                💰 ${request.amount.toLocaleString()}
                              </h5>
                              <p style={{ color: '#ccc', margin: '0 0 4px 0', fontSize: '0.9rem' }}>
                                <strong>Reason:</strong> {request.reason}
                              </p>
                              <p style={{ color: '#aaa', margin: 0, fontSize: '0.8rem' }}>
                                Requested: {new Date(request.requestedAt).toLocaleDateString()}
                              </p>
                              {request.parentResponse && (
                                <p style={{ color: '#10b981', margin: '4px 0 0 0', fontSize: '0.8rem' }}>
                                  Approved: ${request.parentResponse.approvedAmount.toLocaleString()} at {request.parentResponse.interestRate}% for {request.parentResponse.durationDays} days
                                </p>
                              )}
                            </div>
                            <span style={{
                              background: request.status === 'approved' ? '#10b981' : '#ef4444',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              {request.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'loans' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 16px 0' }}>Active Loans</h3>
              {activeLoans.length === 0 ? (
                <div style={{ 
                  color: '#aaa', 
                  textAlign: 'center', 
                  padding: '40px',
                  background: '#2a2a3e',
                  borderRadius: '12px'
                }}>
                  No active loans
                </div>
              ) : (
                activeLoans.filter(loan => loan.status === 'active').map(loan => (
                  <div
                    key={loan.id}
                    style={{
                      background: '#2a2a3e',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(74,74,106,0.3)'
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px'
                    }}>
                      <div>
                        <h4 style={{ color: '#10b981', margin: '0 0 8px 0' }}>
                          Principal: ${loan.principal.toLocaleString()}
                        </h4>
                        <p style={{ color: '#ccc', margin: 0 }}>
                          Interest Rate: {loan.interestRate}%
                        </p>
                      </div>
                      <div>
                        <h4 style={{ color: '#f59e0b', margin: '0 0 8px 0' }}>
                          Total Owed: ${loan.totalOwed.toLocaleString()}
                        </h4>
                        <p style={{ color: '#ccc', margin: 0 }}>
                          Due: {new Date(loan.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span style={{
                          background: loan.status === 'active' ? '#10b981' : '#ef4444',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {loan.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}