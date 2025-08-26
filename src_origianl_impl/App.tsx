import React from 'react';
import { ThemeProvider } from 'styled-components';
import './styles/legacy-ui.css';
import './styles/legacy-cyberpunk.css';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { GameLayout } from './components';

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = React.useState<Error | null>(null);
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>运行时错误: {error.message}</div>;
  return (
    <React.Fragment>
      {React.Children.map(children, child => {
        try { return child; } catch (e: any) { setError(e); return null; }
      })}
    </React.Fragment>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ErrorBoundary>
        <GameLayout />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
