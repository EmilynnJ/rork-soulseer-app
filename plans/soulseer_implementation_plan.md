# SoulSeer App Implementation Plan

## Technical Specifications & Features Extracted

### Core Architecture (from DEV_PLAN)
- **Monorepo Structure**: Turborepo + pnpm
- **Apps**: mobile (Expo), web (Next.js), admin (Next.js), api (NestJS), worker (Node/Nest)
- **Shared Packages**: types, contracts, auth, realtime, payments, ui-web, ui-mobile, theme, config, testing
- **Database**: Neon Postgres + Prisma
- **Realtime**: Agora (RTC/live streaming), Ably (chat/presence)
- **Payments**: Stripe + Stripe Connect, hybrid billing (IAP for mobile digital goods)
- **Deployment**: Vercel (web/admin), AWS ECS (api/worker), Neon Postgres, Redis

### Key Features (from BUILD_GUIDE.txt)

#### 1. User Roles & Authentication
- **Clients**: Self-signup via Auth0 (email/social)
- **Readers**: Public application form, admin approval & account creation
- **Admins**: Internal provisioning only
- **Roles**: client, reader, admin, moderator, support

#### 2. Core Functionality
- **On-demand pay-per-minute readings**: Chat, voice, video via Agora
- **Session management**: Minute tracking, billing ticks, disconnect protection
- **Wallet system**: Prepay balance, top-ups, transaction history
- **Live streaming**: Agora-powered with gifting system
- **Messaging**: Ably-based with free/paid reply options
- **Community forums**: Topic-based with moderation
- **Marketplace**: Services, digital/physical products synced with Stripe

#### 3. Payment & Revenue
- **70/30 split** (reader/platform)
- **Stripe Connect** for reader payouts ($15+ balance)
- **Hybrid billing**: Stripe for web, IAP for mobile digital goods
- **Wallet-ledger system** for session billing

#### 4. Technical Requirements
- **Realtime**: Agora (RTC/live), Ably (chat/presence/messaging)
- **Auth**: Auth0 with RBAC
- **Database**: Neon Postgres with ACID compliance
- **Testing**: Vitest/Jest, Playwright, Maestro, k6, ZAP/CodeQL
- **Observability**: Sentry, PostHog, structured logging
- **Security**: E2E encryption, PCI compliance, GDPR/CCPA

## Comprehensive Implementation Plan

### Phase 1: Monorepo Setup & Core Infrastructure
- [ ] Set up Turborepo + pnpm workspace structure
- [ ] Create apps/mobile (Expo), apps/web (Next.js), apps/admin (Next.js), apps/api (NestJS), apps/worker
- [ ] Set up shared packages (types, contracts, auth, realtime, payments, ui, theme, config, testing)
- [ ] Configure Prisma + Neon Postgres database schema
- [ ] Set up Auth0 integration with custom claims
- [ ] Implement BullMQ + Redis for background jobs
- [ ] Configure Sentry + PostHog observability

### Phase 2: Authentication & User Management
- [ ] Implement Auth0 Universal Login for clients
- [ ] Create reader application workflow (form → admin review → approval/denial)
- [ ] Build admin reader provisioning system (account creation, profile editing)
- [ ] Implement RBAC with Nest guards and policy layer
- [ ] Set up role-specific route guards for web/mobile

### Phase 3: Core Reading System
- [ ] Implement Agora RTC integration for voice/video sessions
- [ ] Build session state machine (requested → active → reconnect_grace → ended)
- [ ] Create wallet-ledger system with minute-by-minute billing
- [ ] Implement session disconnect protection with grace period
- [ ] Build transcript storage and summary generation
- [ ] Create rating/review system with dispute resolution

### Phase 4: Payment & Wallet System
- [ ] Set up Stripe Customers and PaymentMethods
- [ ] Implement wallet top-up functionality
- [ ] Create minute-billing engine with server-authoritative ticks
- [ ] Build Stripe Connect Express integration for reader payouts
- [ ] Implement daily payout job with $15 threshold
- [ ] Create hybrid billing system (Stripe web, IAP mobile)

### Phase 5: Live Streaming & Gifting
- [ ] Implement Agora live streaming with host/audience roles
- [ ] Build virtual gift catalog and sending system
- [ ] Create gift-to-earnings conversion system
- [ ] Implement leaderboards and recognition features
- [ ] Add stream recording with access control

### Phase 6: Messaging & Community
- [ ] Implement Ably-based messaging with session-scoped channels
- [ ] Build forum system with topic-based threads
- [ ] Create moderation tools (flagging, automated scanning, admin queue)
- [ ] Implement free messaging with reader-controlled paid replies
- [ ] Add presence indicators and typing events

### Phase 7: Marketplace & Shop
- [ ] Set up Stripe product sync for catalog
- [ ] Build digital product delivery system (Backblaze B2)
- [ ] Implement physical product shipping (Shippo integration)
- [ ] Create commission split system (70/30)
- [ ] Build admin inventory management UI

### Phase 8: Admin Dashboard (Control Hub)
- [ ] Implement user verification and reader application workflow
- [ ] Build content moderation queues and policy enforcement tools
- [ ] Create financial admin console (refunds, adjustments, payouts)
- [ ] Implement analytics dashboards (engagement, revenue, growth)
- [ ] Build Stripe-backed catalog sync and product editor

### Phase 9: UI/UX Implementation
- [ ] Implement celestial theme with pink/black/gold/white color scheme
- [ ] Use Alex Brush (headings) and Playfair Display (body) fonts
- [ ] Create responsive design with mobile-first approach
- [ ] Build navigation structure (Home, Readers, About, Live, Shop, Community, Messages, Dashboard, Help, Profile)
- [ ] Implement accessibility features (colorblind mode, text scaling, screen reader support)

### Phase 10: Testing & Quality Assurance
- [ ] Write unit tests for business logic (wallet math, billing, session state)
- [ ] Create integration tests (Auth0, Stripe, Agora, Ably)
- [ ] Implement E2E tests with Playwright (web) and Maestro (mobile)
- [ ] Set up realtime/load testing (concurrent sessions, chat bursts)
- [ ] Perform security testing (auth boundaries, webhook validation, input sanitization)
- [ ] Conduct app-store compliance testing (billing paths, privacy, account deletion)

### Phase 11: Deployment & Operations
- [ ] Set up Vercel deployment for web/admin apps
- [ ] Configure AWS ECS for API/worker services
- [ ] Implement CI/CD pipelines with environment strategy (local, dev, staging, production)
- [ ] Create monitoring dashboards and alerting
- [ ] Set up incident response runbooks

### Phase 12: BUILD_GUIDE Traceability & Final Audit
- [ ] Create requirement matrix with unique IDs from BUILD_GUIDE.txt
- [ ] Map implementation evidence (code paths, tests, screenshots)
- [ ] Generate Complete/Partial/Missing audit report
- [ ] Perform visual audit against exact specifications
- [ ] Conduct app-store submission readiness check
- [ ] Execute final UAT and signoff

## Monorepo Structure Alignment

```
soulseer-monorepo/
├── apps/
│   ├── mobile/          # Expo React Native (TypeScript)
│   ├── web/             # Next.js (TypeScript) - Public + PWA
│   ├── admin/           # Next.js (TypeScript) - Admin control hub
│   ├── api/             # NestJS + Fastify - REST API
│   └── worker/          # Node/Nest - Background jobs
├── packages/
│   ├── types/           # Shared DTOs, enums, events
│   ├── contracts/       # Zod schemas + OpenAPI
│   ├── auth/            # Auth0 JWT validation, RBAC
│   ├── realtime/        # Agora/Ably token DTOs
│   ├── payments/        # Wallet ledger, Stripe types
│   ├── ui-web/          # Shared web components
│   ├── ui-mobile/       # Shared mobile components
│   ├── theme/           # Design tokens
│   ├── config/          # Env validation
│   └── testing/         # Test utilities
├── prisma/              # Schema + migrations
├── docs/
│   ├── requirements/    # BUILD_GUIDE traceability
│   └── qa/              # Test plans, checklists
├── infra/               # Docker, deployment manifests
└── scripts/             # Audit, seeders, helpers
```

## Tooling & Technology Stack

### Frontend
- **Mobile**: Expo React Native, NativeWind, Zustand
- **Web/Admin**: Next.js App Router, Tailwind CSS, TanStack Query
- **Forms**: React Hook Form + Zod validation
- **State**: TanStack Query + Zustand
- **Styling**: Tailwind (web), NativeWind (mobile) + shared theme tokens

### Backend
- **API**: NestJS + Fastify adapter
- **Database**: Prisma + Neon Postgres
- **Queue**: BullMQ + Redis
- **Validation**: Zod schemas
- **Auth**: Auth0 JWT validation
- **Realtime**: Agora token service, Ably pub/sub

### DevOps
- **Monorepo**: Turborepo + pnpm
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (web), AWS ECS (API/worker)
- **Observability**: Sentry + PostHog + structured logs
- **Testing**: Vitest/Jest, Playwright, Maestro, k6, ZAP/CodeQL

## Key Technical Decisions

1. **Agora over custom WebRTC**: All RTC uses Agora as specified in override
2. **Hybrid billing**: Stripe for web, IAP for mobile digital goods
3. **Admin-created readers**: Reader accounts only created by admins after application approval
4. **Wallet-ledger system**: Server-authoritative billing ticks, not client timers
5. **70/30 revenue split**: Default split with daily payouts over $15 threshold

## Risk Areas & Mitigation

1. **Real-time reliability**: Implement server-authoritative session state with reconnect grace periods
2. **Payment fraud**: Idempotency keys, transaction locks, suspicious pattern detection
3. **App store compliance**: Hybrid billing system with proper IAP implementation
4. **Cross-platform consistency**: Shared theme packages and design tokens
5. **Performance**: Mobile-first optimization with lazy loading and code splitting

## Next Steps

1. Review this plan with stakeholders
2. Prioritize Phase 1 (monorepo setup) as foundation
3. Begin implementation with core infrastructure
4. Iterate through phases with continuous testing
5. Conduct final audit before app store submission