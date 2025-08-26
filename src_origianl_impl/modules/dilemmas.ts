import { Dilemma } from '../types';

// Dilemma questions presented during gameplay
export const dilemmas: Dilemma[] = [
  {
    text: '市场波动加剧，你会选择？',
    options: [
      {
        text: '坚持长期持有',
        consequence: '你顶住波动，学习到长期主义。',
        skill: 'risk-management'
      },
      {
        text: '立即止损',
        consequence: '你及时止损，保住了本金。',
        skill: 'risk-management'
      },
      {
        text: '逢低加仓',
        consequence: '你在低位加仓，承担更高风险也可能获得回报。',
        skill: 'diversification'
      }
    ]
  },
  {
    text: '突发利空消息，你会选择？',
    options: [
      {
        text: '评估后再行动',
        consequence: '你进行了冷静分析，提升了风险管理能力。',
        skill: 'risk-management'
      },
      {
        text: '立刻抛售',
        consequence: '你迅速卖出，避免了更大损失但也可能错过反弹。',
        skill: 'knowledge'
      },
      {
        text: '忽略消息',
        consequence: '你忽视了消息，市场继续下跌造成损失。',
        skill: 'knowledge'
      }
    ]
  },
  {
    text: '资产暴涨，你会选择？',
    options: [
      {
        text: '立即卖出获利',
        consequence: '你锁定利润，见好就收。',
        skill: 'risk-management'
      },
      {
        text: '继续持有',
        consequence: '你期待更高收益，但风险也随之增加。',
        skill: 'knowledge'
      },
      {
        text: '加码买入',
        consequence: '你加大投入，若回调可能遭受损失。',
        skill: 'risk-management'
      }
    ]
  },
  {
    text: '行业政策变化，你会选择？',
    options: [
      {
        text: '调整资产配置',
        consequence: '你灵活调整，成功分散了风险。',
        skill: 'diversification'
      },
      {
        text: '保持原策略',
        consequence: '你坚持原有策略，可能错过新机会。',
        skill: 'knowledge'
      },
      {
        text: '深入研究再决策',
        consequence: '你通过学习提升了知识水平。',
        skill: 'knowledge'
      }
    ]
  },
  {
    text: '朋友推荐新资产，你会选择？',
    options: [
      {
        text: '自行研究后决定',
        consequence: '你通过研究提高了知识水平。',
        skill: 'knowledge'
      },
      {
        text: '跟风立即购买',
        consequence: '盲目跟风，风险增加。',
        skill: 'risk-management'
      },
      {
        text: '礼貌拒绝',
        consequence: '你保持稳健策略，增强风险管理。',
        skill: 'risk-management'
      }
    ]
  }
];
