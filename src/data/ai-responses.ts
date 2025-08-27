// AI Preset Response Data
export interface AIResponse {
	question: string;
	answer: string;
	category?: 'basic' | 'investment' | 'risk' | 'diversification';
}

export const AI_RESPONSES: AIResponse[] = [
	{
		question: 'what is diversification',
		answer: 'Diversification is like not putting all your eggs in one basket! Spread your money across different investments so if one doesn\'t perform well, others can help stabilize your overall returns.',
		category: 'diversification'
	},
	{
		question: 'what are stocks',
		answer: 'Stocks are like ownership certificates of a small part of a company! When you buy stocks, you own a tiny piece of that company. If the company does well, your stock might increase in value!',
		category: 'basic'
	},
	{
		question: 'what are bonds',
		answer: 'Bonds are like IOUs! You lend money to the issuer (like governments or companies), and they promise to pay you back the principal at a future date, plus interest as a thank you!',
		category: 'basic'
	},
	{
		question: 'what is ETF',
		answer: 'An ETF is like an investment gift basket! It contains many different stocks or bonds inside. When you buy one ETF, you\'re simultaneously buying a basket of investments - it\'s a super convenient diversification tool!',
		category: 'basic'
	},
	{
		question: 'what is risk',
		answer: 'Investment risk is like the weather - sometimes it\'s sunny (making money), sometimes you might encounter storms (losing money). The key is learning to read the weather forecast and be prepared!',
		category: 'risk'
	},
	{
		question: 'how to control risk',
		answer: 'Here are some risk control tips: 1) Don\'t put all your money in one investment 2) Choose a risk level that suits you 3) Stay calm, don\'t panic over short-term fluctuations 4) Regularly review and adjust your portfolio.',
		category: 'risk'
	},
	{
		question: 'what is market volatility',
		answer: 'Market volatility is like ocean waves - sometimes high, sometimes low! This is very normal. Smart investors learn to surf the waves instead of being scared away by them.',
		category: 'investment'
	},
	{
		question: 'is long term investing good',
		answer: 'Long-term investing is like planting a tree! Although you won\'t see big changes in the short term, over time, that little sapling will grow into a towering tree. Patience is an investor\'s best friend!',
		category: 'investment'
	},
	{
		question: 'what is compound interest',
		answer: 'Compound interest is like a snowball! Your earnings also earn returns, getting bigger and bigger. Einstein even called compound interest the eighth wonder of the world!',
		category: 'investment'
	},
	{
		question: 'why should I invest',
		answer: 'Investing is like giving your money a job! Let it work hard to earn more money for you, so your wealth can slowly grow and help you achieve your dreams.',
		category: 'basic'
	}
];

// 根据关键词查找匹配的回答
export function findMatchingResponse(question: string): string | null {
	const lowerQuestion = question.toLowerCase();
	
	for (const response of AI_RESPONSES) {
		if (lowerQuestion.includes(response.question.toLowerCase())) {
			return response.answer;
		}
	}
	
	return null;
}