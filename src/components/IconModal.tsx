import React from 'react';
import './IconModal.css';

interface IconModalProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
}

const IconModal: React.FC<IconModalProps> = ({ label, value, onChange, onClose }) => {
  return (
    <div className="icon-modal-bg">
  <div className="icon-modal-content">
    <h3>{label} Settings</h3>
    <div className="vertical-bar-container">
      <input
        type="range"
        min={0}
        max={100}
        step={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="vertical-range"
      />
      <span className="vertical-bar-label">{value}%</span>
    </div>
    <button className="icon-modal-close" onClick={onClose}>Close</button>
  </div>
</div>
  );
};

export default IconModal;
