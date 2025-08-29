import { useState } from 'react';
import { createPortal } from 'react-dom';

interface MoneyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (amount: number, reason: string) => void;
}

export function MoneyRequestModal({ isOpen, onClose, onSubmitRequest }: MoneyRequestModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleSubmit = () => {
    const numAmount = Number(amount);
    if (numAmount > 0 && reason.trim()) {
      onSubmitRequest(numAmount, reason.trim());
      setAmount('');
      setReason('');
      onClose();
    }
  };

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
        background: 'rgba(30, 30, 46, 0.85)',
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
          maxWidth: '480px',
          background: 'linear-gradient(145deg, #23233e 0%, #181826 100%)',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(74,74,106,0.3)',
          background: 'linear-gradient(145deg, #2a2a3e, #1e1e2e)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.3rem', 
            color: '#fff', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            💰 Request Money from Parents
          </h3>
          <button
            onClick={onClose}
            style={{
              fontSize: '2rem',
              color: '#aaa',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '32px 32px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: '#ccc',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Amount ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="1"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid #4a4a6a',
                fontSize: '1.1rem',
                background: '#23233e',
                color: '#fff',
                fontWeight: '500'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#ccc',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              Reason for Request
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you need this money..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid #4a4a6a',
                fontSize: '1rem',
                background: '#23233e',
                color: '#fff',
                fontWeight: '500',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </div>

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            color: '#93c5fd',
            fontSize: '0.9rem'
          }}>
            📝 <strong>Note:</strong> Your parents will review this request and may set interest rates and repayment terms if approved.
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '10px'
          }}>
            <button
              onClick={onClose}
              style={{
                background: '#23233e',
                color: '#aaa',
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!amount || Number(amount) <= 0 || !reason.trim()}
              style={{
                background: (!amount || Number(amount) <= 0 || !reason.trim()) 
                  ? '#666' 
                  : 'linear-gradient(145deg, #10b981, #059669)',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: (!amount || Number(amount) <= 0 || !reason.trim()) 
                  ? 'not-allowed' 
                  : 'pointer',
                opacity: (!amount || Number(amount) <= 0 || !reason.trim()) ? 0.6 : 1
              }}
            >
              💌 Send Request
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}