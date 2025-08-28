# Legacy Guardians – Technical Brief

## Tools, Technologies, Data, and Models
- **Frontend:** React 19 with TypeScript, bundled by Vite.
- **Visualization:** Recharts for asset allocation and portfolio feedback.
- **State & Game Logic:** Custom React hooks and an Event Manager handling missions and market events.
- **Data:** Pre-baked historical and simulated market data stored locally.
- **AI Companion:** General-purpose LLM dialogue with scripted fallbacks when the network is unavailable or the API key fails.
- **APIs:** None in the MVP; all data is mock or historical.

## System Architecture and Workflow
1. **Mission System** – draws challenge cards with objectives.
2. **Asset Allocation** – players adjust asset weights so totals reach 100%.
3. **Market Event System** – random events apply modifiers to assets.
4. **Simulation Engine** – computes portfolio results from historical data.
5. **Feedback Module** – AI companion reacts and suggests adjustments.
6. **Achievement & Reporting** – stars, badges, and parent-facing reports.
7. **Parent Controls** – guardians set allowances, whitelists, and review activity.

**Gameplay Flow:** Mission → Allocation → Event Simulation → AI Feedback → Settlement.

## Educational Impact and Target User Benefits
- Builds financial literacy for teens (12–18) through zero-risk simulation.
- Teaches diversification, risk/return trade-offs, portfolio thinking, and market volatility.
- Encourages parent-child dialogue via reports and configurable boundaries.

## Known Limitations and Directions for Improvement
- Currently operates in a historical-data mode; real-time market APIs can replace or augment it later.
- AI companion uses a general-purpose LLM; domain-specific models can provide more precise financial guidance.
- No persistent backend; progress stored locally on the device.

**Future Enhancements**
- Integrate real-time data feeds and analytics services.
- Adopt finance-trained LLMs (e.g., BloombergGPT, FinGPT, FinBERT) for more tailored coaching.
- Provide backend support for multi-device play and long-term progress tracking.
