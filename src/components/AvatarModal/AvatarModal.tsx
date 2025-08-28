import React, { useState } from 'react';

interface AvatarModalProps {
  avatarUrl: string;
  nickname: string;
  setAvatarUrl: (url: string) => void;
  setNickname: (name: string) => void;
  onClose: () => void;
}

const AvatarModal: React.FC<AvatarModalProps> = ({
  avatarUrl,
  nickname,
  setAvatarUrl,
  setNickname,
  onClose
}) => {
  const [localName, setLocalName] = useState(nickname ?? '');
  const [localAvatar, setLocalAvatar] = useState(avatarUrl ?? '');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validateName = (name: string) => {
    if (!name.trim()) return 'Nickname required';
    if (name.length > 16) return 'Max 16 characters';
    return '';
  };

  const handleSave = () => {
    const v = validateName(localName);
    if (v) {
      setError(v);
      return;
    }
    setAvatarUrl(localAvatar);
    setNickname(localName);
    try {
      localStorage.setItem('avatarUrl', localAvatar);
      localStorage.setItem('nickname', localName);
    } catch (err) {
      console.error('Failed to save avatar or nickname:', err);
    }
    onClose();
  };

  return (
    <div className="main-modal" onClick={onClose} aria-modal="true" role="dialog">
      <div className="main-modal-content" tabIndex={-1} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 12 }}>Edit Avatar &amp; Nickname</h3>

        <img
          src={localAvatar || ''}
          alt="avatar-preview"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            marginBottom: 12,
            objectFit: 'cover',
            background: '#eee',
            border: '2px solid #ccc'
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23eee"/></svg>';
          }}
        />

        <label style={{ display: 'inline-block', marginBottom: 12, cursor: 'pointer' }}>
          <span style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: 8 }}>Choose image…</span>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setLocalAvatar(String(reader.result || ''));
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>

        <input
          type="text"
          value={localName}
          onChange={(e) => {
            const v = e.target.value;
            setLocalName(v);
            setTouched(true);
            setError(validateName(v));
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave();
          }}
          placeholder="Enter nickname"
          maxLength={16}
          style={{
            width: '100%',
            marginBottom: 8,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />

        <div style={{ minHeight: 22 }}>
          {error && (
            <div style={{ color: 'red', fontSize: '0.92rem', marginBottom: 8 }}>
              {error}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#eee', color: '#2a4e7c', padding: '8px 12px', borderRadius: 8, border: 'none' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={touched && !!error}
            style={{
              background: touched && !!error ? '#9bb7d1' : '#2a4e7c',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: touched && !!error ? 'not-allowed' : 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
