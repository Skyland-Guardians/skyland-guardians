// Sample market events for demonstration. dayIndex is 0-based and ties to simulated series days.
export const SAMPLE_EVENTS = [
  {
    id: 'ev-crash-1',
    title: 'Tech Market Crash',
    dayIndex: 5,
  targets: ['sword', 'crystal', 'yield'],
    effect: { type: 'mul', value: 0.5 }, // multiply base return by 0.5 (make negative deeper)
    description: 'Major sell-off in tech & crypto due to sudden news.',
    duration: 1
  },
  {
    id: 'ev-intervene-1',
    title: 'Government Intervention',
    dayIndex: 6,
    targets: ['sword', 'crystal'],
    effect: { type: 'add', value: 0.25 }, // add +25% (big rebound) — in decimal large to illustrate
    description: 'Policy support introduced, markets rebound sharply.',
    duration: 2
  },
  {
    id: 'ev-storm-10',
    title: 'Global Economic Mist',
    dayIndex: 10,
    targets: ['all'],
    effect: { type: 'add', value: -0.05 },
    description: 'Global risk-off sentiment reduces returns across the board.',
    duration: 2
  }
];
