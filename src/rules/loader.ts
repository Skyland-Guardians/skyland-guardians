/**
 * Rules Loader - Automatically load and apply development rules
 * This file ensures all rules are correctly loaded and applied
 */

interface Rule {
	id: string;
	file: string;
	priority: number;
	description: string;
	alwaysApply: boolean;
	tags: string[];
	content?: string;
}

export interface RulesConfig {
	project: string;
	version: string;
	description: string;
	rules: Rule[];
	metadata: {
		lastUpdated: string;
		maintainer: string;
		contact: string;
	};
	usage: {
		forDevelopers: string;
		forAI: string;
		forReviewers: string;
	};
	compatibility: {
		typescript: string;
		react: string;
		nextjs: string;
		node: string;
	};
}

/**
 * Rules Manager Class
 * Responsible for loading, caching and applying development rules
 */
export class RulesManager {
	private static instance: RulesManager;
	private rules: Map<string, Rule> = new Map();
	private config: RulesConfig | null = null;

	private constructor() {
		this.loadRules();
	}

	public static getInstance(): RulesManager {
		if (!RulesManager.instance) {
			RulesManager.instance = new RulesManager();
		}
		return RulesManager.instance;
	}

	/**
	 * Load all rules
	 */
	private async loadRules(): Promise<void> {
		try {
			// 加载配置文件
			const configResponse = await fetch('/src/rules/rules.config.json');
			this.config = await configResponse.json();

			// 加载所有规则文件
			if (this.config && this.config.rules) {
				for (const rule of this.config.rules) {
					await this.loadRuleContent(rule);
				}
			}

			console.log(`✅ Successfully loaded ${this.rules.size} development rules`);
		} catch (error) {
			console.error('❌ Failed to load rules:', error);
		}
	}

	/**
	 * Load content of a single rule file
	 */
	private async loadRuleContent(rule: Rule): Promise<void> {
		try {
			const response = await fetch(`/src/rules/${rule.file}`);
			const content = await response.text();
			
			this.rules.set(rule.id, {
				...rule,
				content
			});
		} catch (error) {
			console.error(`❌ Failed to load rule ${rule.id}:`, error);
		}
	}

	/**
	 * Get all rules
	 */
	public getAllRules(): Rule[] {
		return Array.from(this.rules.values()).sort((a, b) => a.priority - b.priority);
	}

	/**
	 * 根据标签获取规则
	 */
	public getRulesByTag(tag: string): Rule[] {
		return this.getAllRules().filter(rule => rule.tags.includes(tag));
	}

	/**
	 * 获取特定规则
	 */
	public getRule(id: string): Rule | undefined {
		return this.rules.get(id);
	}

	/**
	 * 获取配置信息
	 */
	public getConfig(): RulesConfig | null {
		return this.config;
	}

	/**
	 * 验证规则完整性
	 */
	public validateRules(): boolean {
		const requiredRules = ['code-style', 'cursorrules', 'typescript', 'cursor-ai'];
		return requiredRules.every(id => this.rules.has(id));
	}

	/**
	 * 重新加载规则
	 */
	public async reloadRules(): Promise<void> {
		this.rules.clear();
		await this.loadRules();
	}
}

/**
 * 全局规则管理器实例
 */
export const rulesManager = RulesManager.getInstance();

/**
 * 规则应用器 - 确保代码遵循规则
 */
export class RulesEnforcer {
	/**
	 * 验证代码是否符合规则
	 */
	public static validateCode(_code: string, _ruleIds: string[] = []): string[] {
		const violations: string[] = [];
		
		// 如果指定了规则ID，只验证特定规则
		if (_ruleIds.length > 0) {
			const applicableRules = rulesManager.getAllRules().filter(rule => _ruleIds.includes(rule.id));
			// 这里可以添加基于特定规则的验证逻辑
			console.log(`验证 ${applicableRules.length} 条特定规则`);
		}
		
		// 这里可以添加具体的代码验证逻辑
		// 例如：检查命名约定、代码结构等

		return violations;
	}

	/**
	 * 获取规则摘要
	 */
	public static getRulesSummary(): string {
		const rules = rulesManager.getAllRules();
		return rules.map(rule => 
			`${rule.priority}. ${rule.description} (${rule.file})`
		).join('\n');
	}
}

/**
 * 开发环境规则检查
 */
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
	// 在开发环境中自动验证规则
	setTimeout(() => {
		const isValid = rulesManager.validateRules();
		if (isValid) {
			console.log('🎯 开发规则验证通过');
			console.log(RulesEnforcer.getRulesSummary());
		} else {
			console.warn('⚠️ 开发规则验证失败，请检查规则文件');
		}
	}, 1000);
}

export default rulesManager;
