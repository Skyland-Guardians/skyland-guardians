import dummyResponses from '../constants/ai-dummy-responses.json';
import type { AIPartner } from '../types';

const assetLabels: Record<string, string> = {
  tech: '科技',
  bond: '债券',
  gold: '黄金',
  crypto: '加密',
  esg: 'ESG',
  stablecoin: '稳定币',
  yield: '收益'
};

const riskLabels: Record<'low' | 'medium' | 'high', string> = {
  low: '保守',
  medium: '平衡',
  high: '进取'
};

export async function getAiResponse(
  question: string,
  weights: Record<string, number>,
  personality: AIPartner
): Promise<string> {
  const lower = question.toLowerCase();

  for (const pair of dummyResponses) {
    if (lower.includes(pair.question.toLowerCase())) {
      return pair.answer;
    }
  }

  if (lower.includes('资产') && lower.includes('配置')) {
    const context = Object.entries(weights)
      .map(([k, v]) => `${assetLabels[k] || k}${v}%`)
      .join('，');

    let suggestion = '';
    switch (personality.riskTolerance) {
      case 'low':
        suggestion = '作为保守型伙伴，我建议提高债券、黄金等稳健资产的比例，尽量减少加密等高波动资产。';
        break;
      case 'high':
        suggestion = '作为进取型伙伴，你可以增加加密或科技等高风险资产，追求更高回报，但记得控制风险。';
        break;
      default:
        suggestion = '作为平衡型伙伴，保持股票与债券的均衡，并适度配置加密资产以实现多元化。';
    }

    return `你目前的资产配置为：${context}。${suggestion}`;
  }

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return '未配置 OpenAI API Key，返回预设回答。';
  }

  const context = Object.entries(weights)
    .map(([k, v]) => `${assetLabels[k] || k}: ${v}%`)
    .join(', ');
  const systemPrompt = `${personality.prompt} 你的风险偏好是${riskLabels[personality.riskTolerance]}型。当前玩家的资产配置：${context}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ]
      })
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || '暂时无法回答，请稍后再试。';
  } catch (err) {
    console.error(err);
    return '调用 AI 服务失败，请稍后再试。';
  }
}
