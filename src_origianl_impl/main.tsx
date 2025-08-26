import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index';

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Mounting React app to #root');
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  document.body.innerHTML = '<div style="color:red;padding:2rem;">未找到 root 元素，无法挂载 React 应用。</div>';
}
