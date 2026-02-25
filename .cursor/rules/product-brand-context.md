---
description: Brand context for AIM product development, compliance, architecture, and technical priorities
alwaysApply: false
---

# AIM Product Brand Context

**Use this rule when:** Building or modifying the player app, Coach CRM, Scout Dashboard, backend services, API design, data models, AI pipelines, or any product feature. Also when implementing compliance (GDPR, parental consent), authentication, or technical infrastructure.

**Scope:** Full product—React Native mobile app, Next.js web apps, backend services, AI analysis engine, database, video storage, and integrations.

## Quick Reference (Product)

| Priority | Value |
|----------|-------|
| **Primary Users** | Young players (6-23), many minors requiring parental consent |
| **Business Priority** | Academy B2B first → Consumer → Scouts |
| **Technical Priority** | Mobile app quality is paramount |
| **Compliance** | GDPR non-negotiable, especially for minors |
| **Performance** | Video analysis < 2 min; app crash rate < 1% |
| **Engagement** | Gamification key to retention |
| **Stack** | React Native, Next.js, Supabase, Stripe, S3-compatible storage |

### Key Technical Decisions

- **Mobile:** React Native (iOS + Android)
- **Web:** Next.js with React
- **Backend:** Node.js or Python (FastAPI)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth + custom consent flows
- **Video Storage:** S3-compatible (Supabase Storage or Cloudflare R2)
- **Payments:** Stripe

---

## Full Business Context Document

# Business Context Document: Soccer AI Training Platform

**Document Purpose:** Comprehensive business context reference for AI coding assistants (Cursor, Claude, etc.) to understand the full scope, objectives, and constraints of our product development.

**Last Updated:** February 6, 2026  
**Version:** 1.0

---

## Executive Summary

### Company Vision

**Mission:** Transition young, ambitious soccer players from streets to stadiums through AI-powered training and talent discovery.

**Tagline:** "Your AI Coach. Your Path to Pro."

We are building an AI-powered soccer development ecosystem that democratizes access to elite-level training feedback and scouting opportunities. Players anywhere in the world can record themselves performing drills, receive AI-powered analysis, track their progression, and get discovered by scouts—all from their smartphone.

### Core Value Proposition

| Stakeholder | Value Delivered |
|-------------|-----------------|
| **Players** | Professional-grade feedback without professional-grade costs; pathway to discovery |
| **Coaches** | Scalable oversight of all pupils; automated feedback; data-driven insights |
| **Scouts** | Global talent database; objective performance data; efficient discovery |
| **Academies** | Enhanced training programs; player development tracking; competitive advantage |

### Business Model Summary

| Revenue Stream | Model | Target |
|----------------|-------|--------|
| **Academies (B2B)** | Per-student batch pricing | Primary (Phase 1) |
| **Consumer Subscriptions** | Freemium + Premium tiers | Secondary (Phase 2) |
| **Scout Access** | Subscription + per-contact fees | Tertiary (Phase 3) |

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SOCCER AI PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   PLAYER    │  │   COACH     │  │   SCOUT     │             │
│  │    APP      │  │    CRM      │  │  DASHBOARD  │             │
│  │ (iOS/Android)│  │   (Web)     │  │   (Web)     │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         └────────────────┼────────────────┘                     │
│                          ▼                                      │
│              ┌───────────────────────┐                          │
│              │     API GATEWAY       │                          │
│              └───────────┬───────────┘                          │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  User | Challenge | Video | Analytics Services             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          ▼                                      │
│              ┌───────────────────────┐                          │
│              │   AI ANALYSIS ENGINE  │                          │
│              └───────────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### Mobile App (React Native)

```
src/
├── components/
├── screens/ (auth, onboarding, home, challenges, recording, feedback, profile, social, subscription)
├── services/
├── stores/
├── hooks/
├── navigation/
├── utils/
└── assets/
```

**Key Libraries:** React Native, React Navigation, React Native Camera/Vision, FFmpeg, Zustand/Redux, React Query, Stripe SDK

### Web Applications (React/Next.js)

- Coach CRM & Scout Dashboard
- Next.js, Tailwind CSS, React Query, Recharts, React Table

### Backend Services

- Node.js + TypeScript OR Python (FastAPI)
- PostgreSQL (Supabase)
- Redis (caching, queues)
- S3-compatible storage (videos)

**API Structure:**
```
/api/v1/
├── auth | users | players | coaches | scouts | academies
├── challenges | submissions | analysis | feedback
├── leaderboards | subscriptions | admin
```

### AI Analysis Engine

```
Video Input → Frame Extraction → Pose Estimation →
Motion Analysis → Technique Classification →
Performance Scoring → Feedback Generation → Output
```

**Models:** Pose Estimation (MediaPipe), Ball Detection (YOLO), Motion Analysis, Technique Classifier, Scoring Engine, LLM Feedback Generator

### Infrastructure

- Hosting: AWS / GCP / DigitalOcean
- Database: Supabase
- Video Storage: S3 or Cloudflare R2
- CDN: CloudFront or Cloudflare
- Monitoring: Sentry, DataDog

---

## Data Model (Core Entities)

- **User:** id, email, phone, password_hash, role, gdpr_consent, parent_email
- **Player:** user_id, date_of_birth, position, level, xp_total, academy_id, is_discoverable
- **Submission:** player_id, challenge_id, video_url, status, analysis_id
- **Analysis:** overall_score, technique_score, metrics_json, feedback_text, annotations_json
- **Additional:** Academy, Coach, Scout, Challenge, Assignment, Leaderboard, Subscription, ContactRequest

---

## Progression System

### Player Levels: Beginner (0) → Rookie (500) → ... → Legend (100,000 XP)
### XP Sources: Challenge completion, improvement bonus, streaks, achievements, P2P wins
### Skill Categories: Ball Control, Dribbling, Passing, Shooting, Physical, Game IQ

---

## Compliance & Legal (GDPR)

**Requirements:**
- Lawful basis (consent + legitimate interest)
- Clear privacy policy
- Data minimization
- Right to access, rectify, delete, portability
- Breach notification

**Minor-Specific:**
- Parental consent for users under 16
- Age-appropriate notices
- Limited data collection for minors
- No behavioral advertising to minors

**Registration Flow:**
1. User enters date of birth
2. If under 16: Parental consent (email verification, clear explanation, consent checkboxes)
3. If 16+: Standard consent
4. All users: Privacy policy acceptance

**Data Storage:** EU residency, encryption at rest/transit, access logging, retention policies

---

## Development Roadmap

### MVP (Months 1-3)
- Player: Registration, parental consent, profile, 20 challenges, video record/upload, AI analysis, feedback, progression
- Coach: Login, roster, challenge assignment, submission review, reporting
- Backend: Auth, schema, video pipeline, AI integration, API

### V1.0 (Months 4-6)
- Full progression, leaderboards, achievements, push notifications, subscriptions
- Coach: Advanced analytics, custom challenges, team management

### V1.5 (Months 7-9)
- Scout dashboard MVP, P2P challenges, social, multi-language

### V2.0 (Months 10-12)
- Full scout marketplace, API, white-label options

---

## AI Assistant Guidelines

### Code Generation

**Do:**
- Write production-ready React Native code
- Implement proper error handling
- Consider offline-first patterns
- Follow accessibility guidelines
- Optimize for performance
- Include proper TypeScript types
- Write clean, maintainable code

**Don't:**
- Leave placeholder comments or TODOs
- Skip validation or error handling
- Ignore mobile-specific considerations
- Forget loading and error states
- Use deprecated patterns or libraries

---

**End of Product Brand Context**
