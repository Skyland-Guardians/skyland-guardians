# TypeScript 项目编码规范

## TypeScript Project Coding Standards

支持中英文多语言 Web 应用的完整编码规范  
_Complete coding standards for multilingual (Chinese-English) web applications_

---

## 🎯 适用范围 | Scope

- 中大型 React / Node.js 项目
- 前后端均使用 TypeScript
- 支持多语言（中文 + 英文）
- 使用 `react-i18next`、`i18next` 等国际化方案

---

## 1. 类型设计规范 | Type Design Standards

### ✅ 基本原则 | Basic Principles

#### 1.1 接口与类型定义

```typescript
// ✅ 对象类型使用 interface
interface UserProfile {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
}

// ✅ 联合类型、枚举、工具类型使用 type
type UserRole = 'admin' | 'user' | 'guest';
type EventHandler<T> = (event: T) => void;
type PartialUser = Partial<UserProfile>;

// ✅ 枚举使用 const enum（性能更好）
const enum SurveyType {
	SURVEY = 'survey',
	QUIZ = 'quiz',
	ASSESSMENT = 'assessment',
	IQ = 'iq',
}
```

#### 1.2 严格类型约束

```typescript
// ❌ 禁止使用 any
function processData(data: any) {}

// ✅ 使用 unknown 或具体类型
function processData(data: unknown) {
	if (typeof data === 'string') {
		return data.toUpperCase();
	}
}

// ✅ 使用泛型提供类型安全
function createResponse<T>(data: T): ApiResponse<T> {
	return {
		success: true,
		data,
		timestamp: Date.now(),
	};
}
```

#### 1.3 函数类型注解

```typescript
// ✅ 所有导出函数必须明确参数和返回类型
export function calculateScore(answers: UserAnswer[], questions: Question[]): ScoreResult {
	// 允许 TypeScript 自动推导局部变量类型
	const correctCount = answers.filter(
		(answer, index) => answer.value === questions[index].correctAnswer
	).length;

	return {
		score: Math.round((correctCount / questions.length) * 100),
		correctAnswers: correctCount,
		totalQuestions: questions.length,
	};
}

// ✅ React 组件类型注解
interface SurveyCardProps {
	survey: Survey;
	onEdit: (survey: Survey) => void;
	onDelete: (surveyId: string) => void;
}

export const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onEdit, onDelete }) => {
	// 组件实现
};
```

---

## 2. 配置与严格模式 | Configuration & Strict Mode

### ✅ tsconfig.json 配置

```json
{
	"compilerOptions": {
		"strict": true,
		"noImplicitAny": true,
		"strictNullChecks": true,
		"strictFunctionTypes": true,
		"noImplicitReturns": true,
		"noFallthroughCasesInSwitch": true,
		"noUncheckedIndexedAccess": true,
		"exactOptionalPropertyTypes": true,
		"esModuleInterop": true,
		"allowSyntheticDefaultImports": true,
		"resolveJsonModule": true,
		"isolatedModules": true,
		"skipLibCheck": true,
		"target": "ES2020",
		"lib": ["ES2020", "DOM", "DOM.Iterable"],
		"module": "ESNext",
		"moduleResolution": "bundler"
	},
	"include": ["src/**/*", "types/**/*"],
	"exclude": ["node_modules", "dist", "build"]
}
```

### ✅ ESLint TypeScript 配置

```json
{
	"extends": [
		"@typescript-eslint/recommended",
		"@typescript-eslint/recommended-requiring-type-checking"
	],
	"rules": {
		"@typescript-eslint/no-explicit-any": "error",
		"@typescript-eslint/no-unsafe-assignment": "error",
		"@typescript-eslint/no-unsafe-call": "error",
		"@typescript-eslint/no-unsafe-member-access": "error",
		"@typescript-eslint/no-unsafe-return": "error",
		"@typescript-eslint/prefer-nullish-coalescing": "error",
		"@typescript-eslint/prefer-optional-chain": "error"
	}
}
```

---

## 3. 命名与结构建议 | Naming & Structure Guidelines

### ✅ 命名约定 | Naming Conventions

```typescript
// ✅ 类型名使用 PascalCase
interface UserProfile {}
type ApiResponse<T> = {};
enum SurveyStatus {}

// ✅ 变量、函数使用 camelCase
const userName = 'john';
const isLoggedIn = true;
function handleSubmit() {}

// ✅ 常量使用 SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// ✅ 组件名使用 PascalCase
const SurveyListView: React.FC = () => {};
const QuestionEditor: React.FC<QuestionEditorProps> = () => {};
```

### ✅ 文件命名 | File Naming

```
components/
  survey-list-view.tsx           // 组件文件
  question-editor.tsx
  modals/
    create-survey-modal.tsx

types/
  survey.types.ts               // 类型定义
  api.types.ts

utils/
  validation-helpers.ts         // 工具函数
  date-formatters.ts

hooks/
  use-survey-data.ts           // 自定义 Hooks
  use-localization.ts
```

### ✅ 项目结构 | Project Structure

```
src/
├── components/           # React 组件
│   ├── common/          # 通用组件
│   ├── layout/          # 布局组件
│   └── modals/          # 弹窗组件
├── hooks/               # 自定义 Hooks
├── types/               # TypeScript 类型定义
├── utils/               # 工具函数
├── constants/           # 常量定义
├── contexts/            # React Context
├── locales/             # 国际化资源文件
│   ├── en/
│   │   └── translation.json
│   └── zh/
│       └── translation.json
└── services/            # API 调用
```

---

## 4. 国际化（i18n）开发规则 | Internationalization Rules

### ✅ 文案处理 | Text Content Handling

#### 4.1 禁止硬编码文案

```typescript
// ❌ 错误：硬编码文案
const SurveyCard: React.FC = () => {
  return (
    <div>
      <h3>问卷调查</h3>
      <button>提交</button>
    </div>
  );
};

// ✅ 正确：使用国际化
import { useTranslation } from 'react-i18next';

const SurveyCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t('survey.title')}</h3>
      <button>{t('common.submit')}</button>
    </div>
  );
};
```

#### 4.2 资源文件结构

```
locales/
├── en/
│   ├── translation.json      # 通用翻译
│   ├── survey.json          # 问卷相关
│   ├── question.json        # 题目相关
│   └── error.json           # 错误信息
└── zh/
    ├── translation.json
    ├── survey.json
    ├── question.json
    └── error.json
```

#### 4.3 i18n Key 设计规范

```json
// ✅ locales/en/translation.json
{
	"common": {
		"submit": "Submit",
		"cancel": "Cancel",
		"save": "Save",
		"delete": "Delete",
		"edit": "Edit",
		"loading": "Loading...",
		"error": "An error occurred"
	},
	"survey": {
		"title": "Survey",
		"createNew": "Create New Survey",
		"list": {
			"title": "Survey List",
			"empty": "No surveys found",
			"searchPlaceholder": "Search surveys..."
		}
	},
	"question": {
		"title": "Question {{number}}",
		"type": {
			"singleChoice": "Single Choice",
			"multipleChoice": "Multiple Choice",
			"shortText": "Short Text"
		},
		"validation": {
			"required": "This question is required",
			"minLength": "Answer must be at least {{min}} characters"
		}
	}
}
```

```json
// ✅ locales/zh/translation.json
{
	"common": {
		"submit": "提交",
		"cancel": "取消",
		"save": "保存",
		"delete": "删除",
		"edit": "编辑",
		"loading": "加载中...",
		"error": "发生错误"
	},
	"survey": {
		"title": "问卷调查",
		"createNew": "创建新问卷",
		"list": {
			"title": "问卷列表",
			"empty": "未找到问卷",
			"searchPlaceholder": "搜索问卷..."
		}
	},
	"question": {
		"title": "第 {{number}} 题",
		"type": {
			"singleChoice": "单选题",
			"multipleChoice": "多选题",
			"shortText": "简答题"
		},
		"validation": {
			"required": "此题必填",
			"minLength": "答案至少需要 {{min}} 个字符"
		}
	}
}
```

### ✅ 动态内容处理 | Dynamic Content

```typescript
// ✅ 使用插值避免字符串拼接
const { t } = useTranslation();

// 数字插值
const questionTitle = t('question.title', { number: currentIndex + 1 });

// 多个参数
const validationMessage = t('question.validation.minLength', { min: 10 });

// 复数形式处理
const itemCount = t('survey.itemCount', {
	count: surveys.length,
	defaultValue: '{{count}} survey',
	defaultValue_plural: '{{count}} surveys',
});
```

### ✅ TypeScript 类型支持

```typescript
// types/i18n.types.ts
export interface TranslationKeys {
	'common.submit': string;
	'common.cancel': string;
	'survey.title': string;
	'question.title': { number: number };
	'question.validation.minLength': { min: number };
}

// 类型安全的翻译函数
declare module 'react-i18next' {
	interface CustomTypeOptions {
		resources: {
			translation: TranslationKeys;
		};
	}
}
```

### ✅ i18n 配置 | Configuration

```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		debug: process.env.NODE_ENV === 'development',

		interpolation: {
			escapeValue: false, // React 已经安全
		},

		backend: {
			loadPath: '/locales/{{lng}}/{{ns}}.json',
		},

		detection: {
			order: ['localStorage', 'navigator', 'htmlTag'],
			caches: ['localStorage'],
		},

		resources: {}, // 动态加载
	});

export default i18n;
```

---

## 5. 多语言数据支持 | Multilingual Data Support

### ✅ 后端数据结构设计

```typescript
// 方案1：分字段存储
interface Question {
	id: string;
	questionText_en: string;
	questionText_zh: string;
	type: QuestionType;
	options: Array<{
		id: string;
		text_en: string;
		text_zh: string;
		isCorrect?: boolean;
	}>;
}

// 方案2：嵌套对象存储（推荐）
interface Question {
	id: string;
	questionText: LocalizedString;
	type: QuestionType;
	options: LocalizedOption[];
}

interface LocalizedString {
	en: string;
	zh: string;
}

interface LocalizedOption {
	id: string;
	text: LocalizedString;
	isCorrect?: boolean;
}
```

### ✅ 前端多语言数据处理

```typescript
// utils/localization-helpers.ts
export function getLocalizedText(
  localizedString: LocalizedString,
  language: 'en' | 'zh' = 'en'
): string {
  return localizedString[language] || localizedString.en || '';
}

export function getLocalizedOptions(
  options: LocalizedOption[],
  language: 'en' | 'zh' = 'en'
): Array<{ id: string; text: string; isCorrect?: boolean }> {
  return options.map(option => ({
    id: option.id,
    text: getLocalizedText(option.text, language),
    isCorrect: option.isCorrect
  }));
}

// 使用示例
const QuestionCard: React.FC<{ question: Question }> = ({ question }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'zh';

  const questionText = getLocalizedText(question.questionText, currentLang);
  const options = getLocalizedOptions(question.options, currentLang);

  return (
    <div>
      <h3>{questionText}</h3>
      {options.map(option => (
        <label key={option.id}>
          <input type="radio" value={option.id} />
          {option.text}
        </label>
      ))}
    </div>
  );
};
```

### ✅ API 接口设计

```typescript
// types/api.types.ts
interface CreateQuestionRequest {
	questionText: LocalizedString;
	type: QuestionType;
	options: Array<{
		text: LocalizedString;
		isCorrect?: boolean;
	}>;
}

interface GetQuestionResponse {
	id: string;
	questionText: LocalizedString;
	type: QuestionType;
	options: LocalizedOption[];
	createdAt: string;
	updatedAt: string;
}

// services/question.service.ts
class QuestionService {
	async createQuestion(data: CreateQuestionRequest): Promise<GetQuestionResponse> {
		const response = await api.post('/questions', data);
		return response.data;
	}

	async getQuestions(surveyId: string): Promise<GetQuestionResponse[]> {
		const response = await api.get(`/surveys/${surveyId}/questions`);
		return response.data;
	}
}
```

---

## 6. 测试与开发建议 | Testing & Development Guidelines

### ✅ i18n 单元测试

```typescript
// __tests__/components/survey-card.test.tsx
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import SurveyCard from '../survey-card';

const mockSurvey = {
  id: '1',
  title: { en: 'Test Survey', zh: '测试问卷' },
  description: { en: 'Description', zh: '描述' }
};

describe('SurveyCard', () => {
  it('renders English content when language is en', () => {
    i18n.changeLanguage('en');

    render(
      <I18nextProvider i18n={i18n}>
        <SurveyCard survey={mockSurvey} />
      </I18nextProvider>
    );

    expect(screen.getByText('Test Survey')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders Chinese content when language is zh', () => {
    i18n.changeLanguage('zh');

    render(
      <I18nextProvider i18n={i18n}>
        <SurveyCard survey={mockSurvey} />
      </I18nextProvider>
    );

    expect(screen.getByText('测试问卷')).toBeInTheDocument();
    expect(screen.getByText('描述')).toBeInTheDocument();
  });
});
```

### ✅ i18n Key 验证工具

```typescript
// scripts/check-i18n-keys.ts
import fs from 'fs';
import path from 'path';

interface TranslationFile {
	[key: string]: string | TranslationFile;
}

function flattenKeys(obj: TranslationFile, prefix = ''): string[] {
	const keys: string[] = [];

	for (const key in obj) {
		const fullKey = prefix ? `${prefix}.${key}` : key;

		if (typeof obj[key] === 'object' && obj[key] !== null) {
			keys.push(...flattenKeys(obj[key] as TranslationFile, fullKey));
		} else {
			keys.push(fullKey);
		}
	}

	return keys;
}

function checkTranslationKeys() {
	const enFile = JSON.parse(
		fs.readFileSync(path.join(__dirname, '../locales/en/translation.json'), 'utf8')
	);

	const zhFile = JSON.parse(
		fs.readFileSync(path.join(__dirname, '../locales/zh/translation.json'), 'utf8')
	);

	const enKeys = flattenKeys(enFile);
	const zhKeys = flattenKeys(zhFile);

	const missingInZh = enKeys.filter(key => !zhKeys.includes(key));
	const missingInEn = zhKeys.filter(key => !enKeys.includes(key));

	if (missingInZh.length > 0) {
		console.error('Missing keys in Chinese translation:', missingInZh);
		process.exit(1);
	}

	if (missingInEn.length > 0) {
		console.error('Missing keys in English translation:', missingInEn);
		process.exit(1);
	}

	console.log('✅ All translation keys are synchronized');
}

checkTranslationKeys();
```

### ✅ 语言切换组件

```typescript
// components/common/language-switcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = ''
}) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <div className={`language-switcher ${className}`}>
      <button
        onClick={() => handleLanguageChange('en')}
        className={i18n.language === 'en' ? 'active' : ''}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="separator">|</span>
      <button
        onClick={() => handleLanguageChange('zh')}
        className={i18n.language === 'zh' ? 'active' : ''}
        aria-label="切换到中文"
      >
        中文
      </button>
    </div>
  );
};
```

### ✅ 开发工具集成

```json
// package.json scripts
{
	"scripts": {
		"i18n:extract": "i18next-parser",
		"i18n:check": "ts-node scripts/check-i18n-keys.ts",
		"i18n:sort": "node scripts/sort-translation-keys.js",
		"type-check": "tsc --noEmit",
		"lint:i18n": "npm run i18n:check && npm run i18n:extract",
		"pre-commit": "npm run type-check && npm run lint:i18n"
	}
}
```

```json
// i18next-parser.config.js
module.exports = {
  locales: ['en', 'zh'],
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{ts,tsx}'],
  sort: true,
  keepRemoved: false,
  defaultNamespace: 'translation',
  namespaceSeparator: ':',
  keySeparator: '.',
  reactNamespace: false,
  useKeysAsDefaultValue: true
};
```

---

## 🏆 最佳实践总结 | Best Practices Summary

### ✅ DO 应该做的

1. **类型安全**：所有导出函数明确类型，避免 `any`
2. **国际化**：所有用户可见文案通过 i18n 处理
3. **一致性**：遵循统一的命名和文件组织规范
4. **测试覆盖**：i18n 文案和多语言数据处理必须测试
5. **自动化**：集成 i18n key 检查到 CI/CD 流程

### ❌ DON'T 不应该做的

1. **硬编码**：组件中直接写中文或英文文案
2. **类型断言**：避免 `as any` 等不安全断言
3. **字符串拼接**：用模板插值替代文案拼接
4. **混合语言**：一个文件中不要混用中英文注释
5. **遗漏处理**：新增功能忘记添加对应的翻译文件

---

## 📚 相关工具和库 | Tools & Libraries

- **TypeScript**: 类型检查和开发支持
- **react-i18next**: React 国际化支持
- **i18next-parser**: 自动提取翻译 key
- **ESLint + @typescript-eslint**: 代码质量检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks 自动化
- **Jest + @testing-library**: 单元测试

---

_此规范适用于 TypeScript + React 多语言项目，定期更新以适应最新的最佳实践。_
