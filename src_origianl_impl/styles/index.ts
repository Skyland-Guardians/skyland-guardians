// Legacy Guardians - Styles Index

// Import all stylesheets
import './legacy-ui.css';
import './legacy-cyberpunk.css';

// Export theme configurations
export const THEMES = {
	cyberpunk: {
		name: 'Cyberpunk',
		primaryColor: '#00fff7',
		secondaryColor: '#ff00cc',
		accentColor: '#f6d365',
		backgroundColor: 'rgba(20,20,40,0.98)',
		textColor: '#fff',
	},
	classic: {
		name: 'Classic',
		primaryColor: '#34495e',
		secondaryColor: '#e67e22',
		accentColor: '#27ae60',
		backgroundColor: '#fff',
		textColor: '#222',
	},
	meme: {
		name: 'Meme',
		primaryColor: '#f6d365',
		secondaryColor: '#e67e22',
		accentColor: '#ff00cc',
		backgroundColor: '#f6d365',
		textColor: '#e67e22',
	},
} as const;

// CSS Variables for dynamic theming
export const CSS_VARIABLES = {
	'--primary-color': THEMES.cyberpunk.primaryColor,
	'--secondary-color': THEMES.cyberpunk.secondaryColor,
	'--accent-color': THEMES.cyberpunk.accentColor,
	'--background-color': THEMES.cyberpunk.backgroundColor,
	'--text-color': THEMES.cyberpunk.textColor,
} as const;

// Utility function to apply theme
export function applyTheme(themeName: keyof typeof THEMES) {
	const theme = THEMES[themeName];
	const root = document.documentElement;
	
	Object.entries(theme).forEach(([key, value]) => {
		if (key !== 'name') {
			root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
		}
	});
	
	// Add theme class to body
	document.body.className = `theme-${themeName}`;
}

// Default theme
export const DEFAULT_THEME = 'cyberpunk' as const;
