# AI Coding Rules for Survey Project

## 📋 Overview

This document defines the coding standards and AI rules for the Survey Project. All AI assistants working on this project must follow these rules to ensure consistency, maintainability, and code quality.

## 🎯 Primary Rules

### 1. **TABS ONLY - Size 4**

- **USE TABS FOR INDENTATION, NEVER SPACES**
- **Tab size must be 4 characters**
- This applies to ALL file types: JS, TS, JSX, TSX, CSS, HTML, JSON, MD
- Never mix tabs and spaces within the same file
- Configure your editor to show whitespace to verify correct indentation

### 2. **Use Project Constants**

- Always import and use constants from `/client/src/constants/index.ts`
- Never use hardcoded strings for types, statuses, etc.
- Examples:

    ```tsx
    // ✅ CORRECT
    if (survey.type === SURVEY_TYPE.ASSESSMENT) {

    // ❌ WRONG
    if (survey.type === 'assessment') {
    ```

### 3. **Consistent File Structure**

```
/client/src/
├── components/          # React components
├── constants/           # Project constants
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## 🚀 Configuration Files

The following configuration files enforce these rules:

### 1. `.editorconfig` - Universal editor settings

- Enforces tab indentation with size 4
- Sets line endings to LF
- Handles trailing whitespace

### 2. `.prettierrc` - Code formatting

```json
{
	"useTabs": true,
	"tabWidth": 4,
	"semi": true,
	"singleQuote": true
}
```

### 3. `.eslintrc.json` - Code linting

```json
{
	"rules": {
		"indent": ["error", "tab"],
		"no-mixed-spaces-and-tabs": "error"
	}
}
```

### 4. `.vscode/settings.json` - VSCode specific

- Disables space insertion
- Sets tab size to 4
- Enables format on save

## 📝 Code Style Guidelines

### TypeScript/JavaScript Files

#### Indentation Example:

```tsx
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
	const [state, setState] = useState('');

	const handleClick = () => {
		if (condition) {
			setState(newValue);
		}
	};

	return (
		<div className="container">
			<h1>{prop1}</h1>
			{state && (
				<div className="content">
					<p>{prop2}</p>
				</div>
			)}
		</div>
	);
};
```

#### Object/Array Formatting:

```tsx
const config = {
	title: 'Survey',
	type: SURVEY_TYPE.ASSESSMENT,
	questions: [
		{
			text: 'Question 1',
			type: QUESTION_TYPE.SINGLE_CHOICE,
			options: ['Option A', 'Option B', 'Option C'],
		},
	],
	settings: {
		timeLimit: 30,
		maxAttempts: 3,
	},
};
```

### CSS/SCSS Files

```css
.container {
	display: flex;
	flex-direction: column;
	padding: 1rem;
}

.content {
	margin-top: 1rem;
}

.content h1 {
	font-size: 2rem;
	color: #333;
}

.content p {
	margin-bottom: 0.5rem;
}
```

### JSON Files

```json
{
	"name": "survey-project",
	"version": "1.0.0",
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"preview": "vite preview"
	},
	"dependencies": {
		"react": "^18.0.0",
		"typescript": "^5.0.0"
	}
}
```

## 🔧 Project-Specific Rules

### 1. **Constants Usage**

```tsx
// Import constants
import { SURVEY_TYPE, QUESTION_TYPE, SURVEY_STATUS, TYPES_REQUIRING_ANSWERS } from '../constants';

// Use in conditionals
if (TYPES_REQUIRING_ANSWERS.includes(survey.type)) {
	// Handle assessment/quiz/iq types
}

// Use in comparisons
const isAssessment = survey.type === SURVEY_TYPE.ASSESSMENT;
```

### 2. **Component Structure**

```tsx
import React, { useState, useEffect } from 'react';
import { ComponentProps } from '../types';
import { SURVEY_TYPE } from '../constants';

interface Props {
	survey: Survey;
	onUpdate: (survey: Survey) => void;
}

const SurveyComponent: React.FC<Props> = ({ survey, onUpdate }) => {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Effect logic with proper indentation
		if (survey.type === SURVEY_TYPE.ASSESSMENT) {
			setLoading(true);
		}
	}, [survey]);

	const handleSubmit = () => {
		// Handler logic
	};

	return <div className="survey-container">{/* JSX content with proper indentation */}</div>;
};

export default SurveyComponent;
```

### 3. **Error Handling**

```tsx
const fetchData = async () => {
	try {
		setLoading(true);
		const response = await api.get('/surveys');
		setSurveys(response.data);
	} catch (error) {
		console.error('Failed to fetch surveys:', error);
		setError('Failed to load surveys');
	} finally {
		setLoading(false);
	}
};
```

## 🧪 Testing Rules

### 1. **Always Test Changes**

- Run `npm run build` to ensure no compilation errors
- Start dev server with `npm run dev` to test functionality
- Check browser console for any errors

### 2. **Verify Indentation**

- Enable whitespace display in your editor
- Ensure all indentation uses tabs (not spaces)
- Check that tab size is set to 4

## 🚨 Common Mistakes to Avoid

### ❌ Wrong Indentation

```tsx
// Wrong - using spaces
const Component = () => {
	return (
		<div>
			<p>Wrong indentation</p>
		</div>
	);
};
```

### ✅ Correct Indentation

```tsx
// Correct - using tabs (size 4)
const Component = () => {
	return (
		<div>
			<p>Correct indentation</p>
		</div>
	);
};
```

### ❌ Hardcoded Strings

```tsx
// Wrong
if (survey.type === 'assessment') {
	// logic
}
```

### ✅ Using Constants

```tsx
// Correct
if (survey.type === SURVEY_TYPE.ASSESSMENT) {
	// logic
}
```

## 📖 Additional Resources

1. **EditorConfig**: https://editorconfig.org/
2. **Prettier**: https://prettier.io/docs/en/configuration.html
3. **ESLint**: https://eslint.org/docs/user-guide/configuring/
4. **TypeScript**: https://www.typescriptlang.org/docs/

## 🎯 Enforcement

These rules are enforced through:

- **EditorConfig**: Universal editor settings
- **Prettier**: Automatic code formatting
- **ESLint**: Code linting and error detection
- **VSCode Settings**: Editor-specific configuration
- **Git Hooks**: Pre-commit validation (if configured)

## 📞 Support

If you encounter any issues with these rules or need clarification, refer to:

1. The configuration files in this project
2. The existing codebase as examples
3. The project documentation in `CLAUDE.md`

Remember: **Consistency is key!** Following these rules ensures that all code in the project maintains the same style and quality standards.
