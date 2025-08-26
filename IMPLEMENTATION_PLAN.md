# Legacy Guardians - Detailed Implementation Plan

## Step 1: Setup Project Structure and Core React Components Framework

### 1.1 Project Configuration
- 1.1.1 Initialize React project with TypeScript support
- 1.1.2 Install required dependencies (React Router, Chart.js, Canvas libraries)
- 1.1.3 Setup ESLint and Prettier configuration
- 1.1.4 Configure build scripts and development server

### 1.2 Folder Structure
- 1.2.1 Create `src/components/` directory structure
- 1.2.2 Create `src/pages/` for main screens
- 1.2.3 Create `src/data/` for mock data and game logic
- 1.2.4 Create `src/utils/` for helper functions
- 1.2.5 Create `src/types/` for TypeScript interfaces
- 1.2.6 Create `src/assets/` for images and static files

### 1.3 Core Component Architecture
- 1.3.1 Create base Layout component
- 1.3.2 Setup React Router for navigation
- 1.3.3 Create global state management (Context API or Redux)
- 1.3.4 Setup CSS modules or styled-components
- 1.3.5 Create common UI components (Button, Card, Modal)

## Step 2: Create Main Screen UI - Skyland Island

### 2.0 UI Interface Breakdown Analysis (Based on Design Assets)
**Layout Structure (1440x810px design)**:
```
┌─────────────────────────────────────────┐
│  Header (User Info + Game Status)      │
├─ Left ─┬─────── Center ──────┬─ Right ─┤
│ Sidebar│   Skyland Island    │AI Panel │
│ (Cards,│   (3D Isometric)    │(Dragon +│
│ Badges)│                     │ Chat)   │
├────────┴─────────────────────┴─────────┤
│  Asset Allocation Toolbar (8 Icons)    │
└─────────────────────────────────────────┘
```

**Key UI Components Identified**:
- **Header**: UserAvatar + "JAMES, GUARD YOUR FORTUNE!" + "DAY 1" + StarCounter(15)
- **Left Sidebar**: "MY CARDS" button + "BADGES" circular button
- **Center**: Floating 3D island with buildings, trees, gradients
- **Right Panel**: Orange dragon AI + blue chat bubble
- **Bottom**: 8 asset icons (SWORD, SHIELD, FOREST, ASK ALI, APPLY, GOLDEN, FOUNTAIN, CRYSTAL, MAGIC)
- **Two States**: Normal (bright) vs Market Chaos (dark + lightning)

### 2.1 Header Section Implementation
- 2.1.1 Create UserInfo component (50x50px circular avatar + welcome text + level)
- 2.1.2 Implement GameStatus component (DAY counter + star counter with blue pill design)
- 2.1.3 Add responsive header layout with proper spacing
- 2.1.4 Integrate header state management for user data

### 2.2 Left Sidebar Navigation
- 2.2.1 Create MY CARDS button (dark blue background + card icon + yellow accent)
- 2.2.2 Implement BADGES circular button (diversification trophy design)
- 2.2.3 Add hover and active states for navigation buttons
- 2.2.4 Position sidebar with fixed width ~150px

### 2.3 Skyland Island Visualization (Center)
- 2.3.1 Create floating island container (600x400px) with orange-blue gradient base
- 2.3.2 Implement building clusters using provided asset images
- 2.3.3 Add multi-colored trees (orange, blue, green) with depth layering
- 2.3.4 Create cloud decorations and atmospheric elements
- 2.3.5 Implement dual state system (normal vs chaos with lightning effects)
- 2.3.6 Add subtle animations for water, clouds, and building lights

### 2.4 Right AI Companion Panel
- 2.4.1 Position orange dragon character sprite (from assets) above chat area
- 2.4.2 Create blue chat bubble component with proper tail positioning
- 2.4.3 Implement dynamic text rendering for AI messages
- 2.4.4 Add character idle animations and speech indicators
- 2.4.5 Design responsive panel width ~280px

### 2.5 Asset Allocation Toolbar (Bottom)
- 2.5.1 Create horizontal toolbar with blue gradient background and rounded corners
- 2.5.2 Implement 8 asset buttons with proper icons and labels:
  - SWORD (⚔️, Technology/Growth, Gold theme)
  - SHIELD (🛡️, Bonds/Defense, Orange-red theme)
  - FOREST (🌲, ESG/Sustainable, Green theme)
  - ASK ALI (🦊, AI Assistant, Orange theme)
  - APPLY (📋, Action Button, Cream theme)
  - GOLDEN (💰, Commodities, Gold theme)
  - FOUNTAIN (⛲, REITs, Blue theme)
  - CRYSTAL (💎, Precious Metals, Blue theme)
  - MAGIC (✨, Alternative Investments, Gold theme)
- 2.5.3 Add hover effects and click interactions
- 2.5.4 Implement responsive button sizing (48x48px or 64x64px)

### 2.6 Visual Design System Implementation
- 2.6.1 Setup color palette: Primary Blues (#4A90E2, #357ABD), Orange (#FF8C42), Gold (#FFD700)
- 2.6.2 Configure background gradients: Normal (light purple #F0E6FF), Chaos (dark purple #2D1B44)
- 2.6.3 Implement typography system: Headers (bold, large), UI labels (uppercase, small)
- 2.6.4 Create consistent spacing and border radius system

### 2.7 State Management Integration
- 2.7.1 Setup user state (avatar, name, level, stars, day)
- 2.7.2 Implement game state (normal/chaos mode, current screen)
- 2.7.3 Create AI chat state management
- 2.7.4 Add asset allocation state tracking

## Step 3: Implement Asset Allocation Slider Screen

### 3.1 Slider Interface Design
- 3.1.1 Create responsive slider container layout
- 3.1.2 Design asset type cards (Sword=Tech, Shield=Bonds, etc.)
- 3.1.3 Implement custom range slider components
- 3.1.4 Add percentage display for each asset

### 3.2 Allocation Logic
- 3.2.1 Implement real-time weight calculation (total = 100%)
- 3.2.2 Add automatic adjustment when one slider changes
- 3.2.3 Create validation for minimum/maximum allocations
- 3.2.4 Add visual feedback for invalid allocations

### 3.3 Visual Feedback
- 3.3.1 Create pie chart visualization of allocation
- 3.3.2 Add color coding for different asset types
- 3.3.3 Implement smooth transitions between allocations
- 3.3.4 Add asset icons and descriptions

### 3.4 User Experience
- 3.4.1 Add tooltips explaining each asset type
- 3.4.2 Create preset allocation buttons (Conservative, Balanced, Aggressive)
- 3.4.3 Implement undo/redo functionality
- 3.4.4 Add confirmation dialog before applying changes

## Step 4: Create Mission Card System

### 4.1 Mission Card Data Structure
- 4.1.1 Define mission types and categories
- 4.1.2 Create mission objectives (ESG ≥ 20%, Diversification, etc.)
- 4.1.3 Design difficulty levels and rewards
- 4.1.4 Implement mission validation logic

### 4.2 Card Generation Engine
- 4.2.1 Create random mission selection algorithm
- 4.2.2 Implement player progress-based mission filtering
- 4.2.3 Add mission rarity and special events
- 4.2.4 Create mission completion tracking

### 4.3 Mission Card UI
- 4.3.1 Design card layout and styling
- 4.3.2 Add mission icon and description
- 4.3.3 Create card flip/draw animations
- 4.3.4 Implement card interaction feedback

### 4.4 Mission Management
- 4.4.1 Create active mission display
- 4.4.2 Add mission progress tracking
- 4.4.3 Implement mission completion detection
- 4.4.4 Create mission history and statistics

## Step 5: Create Market Event Card System

### 5.1 Market Event Data
- 5.1.1 Define event types (Sun, Storm, Mist, etc.)
- 5.1.2 Create event impact matrices for different assets
- 5.1.3 Design event probability distributions
- 5.1.4 Add seasonal and trending events

### 5.2 Event Card Generation
- 5.2.1 Implement weighted random event selection
- 5.2.2 Create event chains and sequences
- 5.2.3 Add rare/special market events
- 5.2.4 Implement historical event replay mode

### 5.3 Event Card UI
- 5.3.1 Design weather-themed card visuals
- 5.3.2 Add animated backgrounds for each event type
- 5.3.3 Create event description and impact preview
- 5.3.4 Implement card reveal animations

### 5.4 Event Processing
- 5.4.1 Create event impact calculation engine
- 5.4.2 Add portfolio adjustment logic
- 5.4.3 Implement result animation system
- 5.4.4 Create event aftermath display

## Step 6: Implement Core Game Loop Logic

### 6.1 Game State Management
- 6.1.1 Design game state structure
- 6.1.2 Implement state transitions between phases
- 6.1.3 Create save/load game functionality
- 6.1.4 Add game session tracking

### 6.2 Turn-Based Flow Control
- 6.2.1 Create turn initialization logic
- 6.2.2 Implement phase progression (Mission → Adjust → Market → Results)
- 6.2.3 Add turn timer and countdown
- 6.2.4 Create turn summary and statistics

### 6.3 Player Action Validation
- 6.3.1 Validate mission completion criteria
- 6.3.2 Check allocation constraints
- 6.3.3 Implement action confirmation system
- 6.3.4 Add error handling and user feedback

### 6.4 Game Loop Orchestration
- 6.4.1 Create main game controller
- 6.4.2 Implement event listeners and handlers
- 6.4.3 Add pause/resume functionality
- 6.4.4 Create game completion detection

## Step 7: Add Market Simulation Engine

### 7.1 Portfolio Calculation Engine
- 7.1.1 Implement weighted portfolio value calculation
- 7.1.2 Create asset correlation matrices
- 7.1.3 Add volatility and risk calculations
- 7.1.4 Implement performance metrics (Sharpe ratio, etc.)

### 7.2 Market Impact Simulation
- 7.2.1 Create event-to-asset impact mapping
- 7.2.2 Implement randomized market movements
- 7.2.3 Add market trend and momentum effects
- 7.2.4 Create realistic price movement patterns

### 7.3 Animation System
- 7.3.1 Design portfolio value change animations
- 7.3.2 Create asset-specific visual effects
- 7.3.3 Implement smooth chart transitions
- 7.3.4 Add celebration/consolation animations

### 7.4 Historical Data Integration
- 7.4.1 Create mock historical price data
- 7.4.2 Implement data interpolation for smooth charts
- 7.4.3 Add data export functionality
- 7.4.4 Create performance comparison tools

## Step 8: Implement AI Companion Feedback System

### 8.1 Feedback Content Creation
- 8.1.1 Write 15+ pre-scripted feedback messages
- 8.1.2 Create context-specific responses (good/bad performance)
- 8.1.3 Design educational tips and hints
- 8.1.4 Add personality and character voice

### 8.2 Feedback Trigger System
- 8.2.1 Create performance analysis triggers
- 8.2.2 Implement milestone and achievement triggers
- 8.2.3 Add time-based feedback prompts
- 8.2.4 Create help request detection

### 8.3 Companion Behavior
- 8.3.1 Design companion emotion states
- 8.3.2 Create context-aware animations
- 8.3.3 Implement speech timing and pacing
- 8.3.4 Add companion customization options

### 8.4 Educational Content
- 8.4.1 Create financial literacy mini-lessons
- 8.4.2 Add concept explanations and definitions
- 8.4.3 Implement progressive learning path
- 8.4.4 Create quiz and knowledge check features

## Step 9: Create Achievement System

### 9.1 Achievement Categories
- 9.1.1 Design performance-based achievements
- 9.1.2 Create learning milestone badges
- 9.1.3 Add streak and consistency rewards
- 9.1.4 Implement special event achievements

### 9.2 Stars and Scoring System
- 9.2.1 Create performance scoring algorithm
- 9.2.2 Implement star rating calculation (1-5 stars)
- 9.2.3 Add bonus multipliers and modifiers
- 9.2.4 Create leaderboard and ranking system

### 9.3 Badge System
- 9.3.1 Design badge artwork and descriptions
- 9.3.2 Create unlock conditions and requirements
- 9.3.3 Implement badge rarity levels
- 9.3.4 Add badge showcase and sharing features

### 9.4 Progress Tracking
- 9.4.1 Create achievement progress bars
- 9.4.2 Implement notification system for unlocks
- 9.4.3 Add achievement history and statistics
- 9.4.4 Create export and sharing functionality

## Step 10: Add Parent Controls Interface

### 10.1 Authentication System
- 10.1.1 Create parent login/signup flow
- 10.1.2 Implement account verification
- 10.1.3 Add password reset functionality
- 10.1.4 Create parent-teen account linking

### 10.2 Control Panel UI
- 10.2.1 Design parent dashboard layout
- 10.2.2 Create settings and preferences interface
- 10.2.3 Add quick action buttons
- 10.2.4 Implement responsive design for mobile

### 10.3 Risk and Quota Management
- 10.3.1 Create risk level selection (Conservative, Balanced, Aggressive)
- 10.3.2 Implement asset allocation limits
- 10.3.3 Add time limits and session controls
- 10.3.4 Create spending/virtual money limits

### 10.4 Approval System
- 10.4.1 Create adventure application flow
- 10.4.2 Implement auto-approval rules
- 10.4.3 Add manual review and approval process
- 10.4.4 Create notification system for parents

## Step 11: Implement Progress Reporting System

### 11.1 Data Collection and Analysis
- 11.1.1 Create user activity tracking
- 11.1.2 Implement performance analytics
- 11.1.3 Add learning progress metrics
- 11.1.4 Create trend analysis algorithms

### 11.2 Chart and Visualization
- 11.2.1 Create diversification trend charts
- 11.2.2 Implement performance comparison graphs
- 11.2.3 Add risk assessment visualizations
- 11.2.4 Create badge and achievement timelines

### 11.3 Report Generation
- 11.3.1 Create PDF report templates
- 11.3.2 Implement dynamic data population
- 11.3.3 Add customizable report sections
- 11.3.4 Create automated report scheduling

### 11.4 Sharing and Export
- 11.4.1 Add email report delivery
- 11.4.2 Create social sharing features
- 11.4.3 Implement data export (CSV, JSON)
- 11.4.4 Add print-friendly report layouts

## Step 12: Add Compliance Labeling

### 12.1 Legal Disclaimer System
- 12.1.1 Create disclaimer text database
- 12.1.2 Add "Educational/Simulation Only" labels throughout UI
- 12.1.3 Implement terms of service integration
- 12.1.4 Create privacy policy compliance

### 12.2 Risk Warning Integration
- 12.2.1 Add investment risk warnings
- 12.2.2 Create age-appropriate disclaimers
- 12.2.3 Implement mandatory acknowledgment flows
- 12.2.4 Add parental consent requirements

### 12.3 UI/UX Compliance
- 12.3.1 Design non-intrusive warning displays
- 12.3.2 Create accessible compliance information
- 12.3.3 Implement multi-language support for warnings
- 12.3.4 Add compliance checking and validation

### 12.4 Documentation and Audit Trail
- 12.4.1 Create compliance documentation
- 12.4.2 Implement user consent logging
- 12.4.3 Add audit trail for user actions
- 12.4.4 Create compliance reporting tools

## Step 13: Polish Demo Flow

### 13.1 Performance Optimization
- 13.1.1 Optimize React component rendering
- 13.1.2 Implement code splitting and lazy loading
- 13.1.3 Add caching and memoization
- 13.1.4 Optimize asset loading and compression

### 13.2 User Experience Polish
- 13.2.1 Add smooth transitions and animations
- 13.2.2 Implement loading states and skeletons
- 13.2.3 Create error boundaries and fallbacks
- 13.2.4 Add accessibility features (ARIA labels, keyboard navigation)

### 13.3 Demo Flow Validation
- 13.3.1 Test complete 5-minute game loop
- 13.3.2 Validate all user interactions
- 13.3.3 Check responsive design across devices
- 13.3.4 Test performance under various conditions

### 13.4 Content and Copy Review
- 13.4.1 Review all text content for clarity
- 13.4.2 Check educational accuracy of financial concepts
- 13.4.3 Ensure age-appropriate language and content
- 13.4.4 Add multilingual support if needed

## Step 14: Final Testing and Presentation Preparation

### 14.1 Comprehensive Testing
- 14.1.1 Perform unit testing on core components
- 14.1.2 Execute integration testing for game flow
- 14.1.3 Conduct user acceptance testing
- 14.1.4 Perform cross-browser and device testing

### 14.2 Bug Fixes and Refinements
- 14.2.1 Address critical bugs and issues
- 14.2.2 Fix UI/UX inconsistencies
- 14.2.3 Optimize performance bottlenecks
- 14.2.4 Implement final feature requests

### 14.3 Presentation Materials
- 14.3.1 Create demo script and walkthrough
- 14.3.2 Prepare presentation slides
- 14.3.3 Record demo videos and screenshots
- 14.3.4 Create technical documentation

### 14.4 Deployment Preparation
- 14.4.1 Setup production build pipeline
- 14.4.2 Configure hosting and deployment
- 14.4.3 Test production environment
- 14.4.4 Prepare rollback and maintenance procedures

---

## Timeline Overview (7-Day Hackathon)

**Day 1**: Steps 1-2 (Project setup and main screen)
**Day 2**: Steps 3-4 (Asset allocation and mission cards)
**Day 3**: Steps 5-6 (Market events and game loop)
**Day 4**: Steps 7-8 (Market simulation and AI companion)
**Day 5**: Step 9 (Achievement system)
**Day 6**: Steps 10-11 (Parent controls and reporting)
**Day 7**: Steps 12-14 (Compliance, polish, and testing)

Each step includes multiple sub-tasks that can be assigned to different team members or tackled sequentially depending on team size and expertise.