// Legacy Guardians - Styled Components Theme

export const theme = {
  colors: {
    // 赛博朋克主题
    cyber: {
      primary: '#00fff7',      // 霓虹蓝
      secondary: '#ff00cc',    // 霓虹粉
      accent: '#e67e22',       // 橙色
      bg: '#1a1a2e',          // 深蓝背景
      bgLight: '#16213e',      // 稍浅背景
      text: '#fff',            // 白色文字
      gray: '#888',            // 灰色
      dark: '#222',            // 深色
      success: '#27ae60',      // 成功绿
      error: '#e74c3c',        // 错误红
    },
    // 经典主题
    classic: {
      primary: '#34495e',
      secondary: '#e67e22',
      accent: '#27ae60',
      bg: '#fff',
      text: '#222',
    },
    // 迷因主题
    meme: {
      primary: '#f6d365',
      secondary: '#e67e22',
      accent: '#ff00cc',
      bg: '#f6d365',
      text: '#e67e22',
    }
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    xxl: '3rem',      // 48px
    xxxl: '4rem',     // 64px
  },
  
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '50%',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    cyber: '0 0 20px rgba(0, 255, 247, 0.3)',
    cyberStrong: '0 0 30px rgba(0, 255, 247, 0.6)',
  },
  
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  }
} as const;

export type Theme = typeof theme;
export type ThemeColors = keyof typeof theme.colors;
