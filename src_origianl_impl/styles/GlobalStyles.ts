import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: ${theme.colors.cyber.bg};
    color: ${theme.colors.cyber.text};
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.cyber.bgLight};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.cyber.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.cyber.secondary};
  }

  /* 选择文本样式 */
  ::selection {
    background-color: ${theme.colors.cyber.primary};
    color: ${theme.colors.cyber.dark};
  }

  /* 焦点样式 */
  :focus {
    outline: 2px solid ${theme.colors.cyber.primary};
    outline-offset: 2px;
  }

  /* 按钮重置 */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* 输入框重置 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* 链接样式 */
  a {
    color: ${theme.colors.cyber.primary};
    text-decoration: none;
    transition: color ${theme.transitions.fast};
  }

  a:hover {
    color: ${theme.colors.cyber.secondary};
  }
`;
