# SOLID Principles Implementation

本文档描述了Survey平台如何遵循SOLID原则进行代码重构。

## 概述

SOLID原则是面向对象设计的五个基本原则，它们帮助我们创建可维护、可扩展和可测试的代码。

## 1. 单一职责原则 (Single Responsibility Principle - SRP)

### 原则

一个类应该只有一个引起它变化的原因。

### 实现

#### 重构前

- `services/stripe.js` 包含了支付处理、订阅管理、配置管理等多个职责

#### 重构后

```javascript
// 支付服务 - 只负责支付处理
class StripePaymentService extends IPaymentService {
	// 支付相关方法
}

// 订阅服务 - 只负责订阅业务逻辑
class SubscriptionService extends ISubscriptionService {
	// 订阅相关方法
}

// 配置类 - 只负责配置管理
class SubscriptionConfig {
	// 配置相关方法
}
```

### 好处

- 每个类都有明确的职责
- 更容易理解和维护
- 降低了类之间的耦合

## 2. 开闭原则 (Open/Closed Principle - OCP)

### 原则

软件实体应该对扩展开放，对修改关闭。

### 实现

#### 配置系统

```javascript
class SubscriptionConfig {
	constructor() {
		this.plans = this.initializePlans();
	}

	// 可以添加新计划而不修改现有代码
	addPlan(planType, planConfig) {
		if (this.plans[planType]) {
			throw new Error(`Plan type '${planType}' already exists`);
		}
		this.plans[planType] = planConfig;
	}

	// 可以更新现有计划而不修改其他代码
	updatePlan(planType, planConfig) {
		if (!this.plans[planType]) {
			throw new Error(`Plan type '${planType}' does not exist`);
		}
		this.plans[planType] = { ...this.plans[planType], ...planConfig };
	}
}
```

#### 支付服务扩展

```javascript
// 可以轻松添加新的支付提供商
class PayPalPaymentService extends IPaymentService {
	// PayPal实现
}

class StripePaymentService extends IPaymentService {
	// Stripe实现
}
```

### 好处

- 新功能通过扩展实现，而不是修改现有代码
- 降低了引入bug的风险
- 提高了代码的稳定性

## 3. 里氏替换原则 (Liskov Substitution Principle - LSP)

### 原则

子类对象应该能够替换其父类对象，而不影响程序的正确性。

### 实现

#### 支付服务接口

```javascript
class IPaymentService {
	async createCheckoutSession(user, planType, successUrl, cancelUrl) {
		throw new Error('Method not implemented');
	}

	async createPortalSession(user, returnUrl) {
		throw new Error('Method not implemented');
	}

	// 其他方法...
}
```

#### 具体实现

```javascript
class StripePaymentService extends IPaymentService {
	async createCheckoutSession(user, planType, successUrl, cancelUrl) {
		// Stripe特定实现
	}

	async createPortalSession(user, returnUrl) {
		// Stripe特定实现
	}
}
```

### 好处

- 任何实现IPaymentService的类都可以无缝替换
- 便于测试和模拟
- 支持多态性

## 4. 接口隔离原则 (Interface Segregation Principle - ISP)

### 原则

客户端不应该被迫依赖它不使用的接口。

### 实现

#### 分离的接口

```javascript
// 支付服务接口
class IPaymentService {
	// 支付相关方法
}

// 订阅服务接口
class ISubscriptionService {
	// 订阅相关方法
}
```

#### 专门的控制器

```javascript
class SubscriptionController {
	constructor(subscriptionService, paymentService) {
		this.subscriptionService = subscriptionService;
		this.paymentService = paymentService;
	}

	// 只使用需要的服务方法
}
```

### 好处

- 客户端只依赖它们实际使用的接口
- 减少了不必要的依赖
- 提高了代码的灵活性

## 5. 依赖倒置原则 (Dependency Inversion Principle - DIP)

### 原则

高层模块不应该依赖低层模块，两者都应该依赖抽象。

### 实现

#### 依赖注入容器

```javascript
class ServiceContainer {
	constructor() {
		this.services = new Map();
		this.singletons = new Map();
	}

	register(name, factory, singleton = true) {
		this.services.set(name, { factory, singleton });
	}

	resolve(name) {
		// 解析依赖
	}
}
```

#### 服务注册

```javascript
// 注册服务
serviceContainer.register('paymentService', container => {
	const StripePaymentService = require('./StripePaymentService');
	return new StripePaymentService();
});

serviceContainer.register('subscriptionService', container => {
	const SubscriptionService = require('./SubscriptionService');
	const paymentService = container.resolve('paymentService');
	return new SubscriptionService(paymentService);
});
```

#### 控制器使用

```javascript
// 从容器获取依赖
const subscriptionController = serviceContainer.resolve('subscriptionController');
```

### 好处

- 高层模块不直接依赖具体实现
- 便于测试和模拟
- 支持依赖注入和配置

## 架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │     Services    │    │   Interfaces    │
│                 │    │                 │    │                 │
│ SubscriptionCtrl│───▶│SubscriptionSvc  │───▶│ISubscriptionSvc │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Middleware    │    │  PaymentSvc     │    │ IPaymentService │
│                 │    │                 │    │                 │
│ subscriptionAuth│    │ StripePayment   │───▶│                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Service       │    │     Config      │
│   Container     │    │                 │
│                 │    │ SubscriptionCfg │
│ Dependency      │    │                 │
│ Injection       │    └─────────────────┘
└─────────────────┘
```

## 文件结构

```
├── interfaces/
│   ├── IPaymentService.js          # 支付服务接口
│   └── ISubscriptionService.js     # 订阅服务接口
├── services/
│   ├── ServiceContainer.js         # 依赖注入容器
│   ├── StripePaymentService.js     # Stripe支付实现
│   └── SubscriptionService.js      # 订阅业务逻辑
├── config/
│   └── SubscriptionConfig.js       # 订阅配置管理
├── controllers/
│   └── SubscriptionController.js   # 订阅控制器
├── middlewares/
│   └── subscriptionAuth.js         # 订阅权限中间件
└── routes/
    └── subscription.js             # 订阅路由
```

## 使用示例

### 1. 添加新的支付提供商

```javascript
class PayPalPaymentService extends IPaymentService {
	async createCheckoutSession(user, planType, successUrl, cancelUrl) {
		// PayPal实现
	}
}

// 注册新服务
serviceContainer.register('paypalPaymentService', container => {
	return new PayPalPaymentService();
});
```

### 2. 添加新的订阅计划

```javascript
const config = serviceContainer.resolve('subscriptionConfig');
config.addPlan('enterprise', {
	name: 'Enterprise Plan',
	price: 9900,
	features: {
		maxSurveys: -1,
		maxQuestionsPerSurvey: -1,
		// 其他特性...
	},
});
```

### 3. 使用权限中间件

```javascript
const { requireFeature, checkLimit } = require('../middlewares/subscriptionAuth');

// 检查功能访问
router.post('/csv-import', requireFeature('csvImport'), csvImportController.import);

// 检查限制
router.post(
	'/surveys',
	checkLimit('maxSurveys', async req => {
		return await Survey.countDocuments({ createdBy: req.user._id });
	}),
	surveyController.create
);
```

## 测试策略

### 1. 单元测试

```javascript
// 测试订阅服务
describe('SubscriptionService', () => {
	let subscriptionService;
	let mockPaymentService;

	beforeEach(() => {
		mockPaymentService = {
			getSubscriptionDetails: jest.fn(),
			isAvailable: jest.fn().mockReturnValue(true),
		};
		subscriptionService = new SubscriptionService(mockPaymentService);
	});

	test('should check feature access correctly', () => {
		const user = { subscriptionTier: 'pro' };
		expect(subscriptionService.hasFeatureAccess(user, 'csvImport')).toBe(true);
	});
});
```

### 2. 集成测试

```javascript
// 测试完整的订阅流程
describe('Subscription Flow', () => {
	test('should create subscription successfully', async () => {
		const response = await request(app)
			.post('/api/subscription/create-checkout-session')
			.send({ planType: 'basic' })
			.expect(200);

		expect(response.body).toHaveProperty('sessionId');
	});
});
```

## 最佳实践

### 1. 接口设计

- 保持接口简洁，只包含必要的方法
- 使用描述性的方法名
- 提供清晰的文档注释

### 2. 依赖注入

- 使用构造函数注入
- 避免服务定位器模式
- 保持依赖关系清晰

### 3. 错误处理

- 在接口层面定义错误类型
- 提供有意义的错误消息
- 实现优雅的错误恢复

### 4. 配置管理

- 将配置与业务逻辑分离
- 支持运行时配置更新
- 提供配置验证

## 总结

通过遵循SOLID原则，我们实现了：

1. **更好的可维护性** - 每个类都有明确的职责
2. **更高的可扩展性** - 新功能通过扩展实现
3. **更强的可测试性** - 依赖注入便于测试
4. **更低的耦合度** - 模块间通过接口交互
5. **更好的可重用性** - 服务可以在不同场景中重用

这种架构为系统的长期维护和扩展奠定了坚实的基础。
