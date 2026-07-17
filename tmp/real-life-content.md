# Real-Life Challenges: content, evidence, and presentation narrative

**Document type:** Internal source of truth and storytelling blueprint  
**Project:** Real-Life Challenges for BeReal  
**Prepared for:** Reformatting the interactive HTML prototype into a formal, evidence-led presentation  
**Primary prototype:** `./index.html`  
**Project year:** 2026  
**Document status:** Working content architecture. This is not the final slide deck and does not modify the prototype by itself.

## 1. Purpose and scope

This document consolidates the research, product decisions, prototype logic, validation evidence, and narrative choices developed for the Real-Life Challenges case study. Its purpose is to make the next prototype revision coherent from beginning to end, so that the interface can present the feature as a causal story rather than as a disconnected set of screens.

The intended presentation should do two things at once:

1. Preserve the technical rigor of the product design process: research framing, evidence quality, prioritization, feature definition, prototyping, validation, limitations, and measurement.
2. Retain the human reason the feature exists: ordinary life can feel too uneventful to post, but a small action with someone close can still be meaningful.

This is an internal document. BeReal may be named directly, and the prototype does not need to reproduce the public portfolio's company-name redaction. If the presentation is later made public, confidentiality requirements must be reviewed again before release.

The next implementation should use this document to add explanatory content beside the phone prototype. No changes to `index.html` are included in this document.

## 2. The central thesis

### One-sentence version

**Real-Life Challenges gives close friends a concrete reason to invite, participate, and return by turning an ordinary action into a private shared moment, without turning BeReal into a tracker.**

### The human opening

The story should begin with a familiar tension, not with a chart:

> Not every day feels worth posting. Most days are work, errands, water, a short walk, a difficult message, or a sky seen from a different city. The problem is not that these moments are meaningless. The problem is that a social product can make them feel too ordinary to share.

That emotional truth creates the bridge to the product problem. When people skip posting because the moment feels uninteresting, when their friends also participate less, and when there is no compelling reason to invite someone new, the social graph becomes quieter. A quieter graph creates less return value. That mechanism is the Empty Room.

### The product thesis

Monthly active use is the primary product pressure. The Empty Room is not a replacement for that problem and should not be presented as its proven cause. It is the most actionable behavioral gap found beneath the larger participation problem and the strongest inspiration for the feature.

The complete causal hypothesis is:

```text
Pressure on repeat participation and MAU
        ↓
Ordinary life feels unworthy of a post, while friends participate less
        ↓
The social graph feels quieter and invitations have weak value
        ↓
Give one person a specific shared action to invite another person into
        ↓
Invite → accept → contribute → reveal → save a shared memory → repeat
        ↓
If repeated over time: stronger reactivation and retention
        ↓
If sustained at scale: possible contribution to MAU
```

The last two arrows remain hypotheses. A focus group can validate comprehension, relevance, trust, and perceived pressure. It cannot validate retention or MAU.

## 3. Evidence language and claim discipline

Use these labels throughout the future presentation and implementation notes.

| Label | Meaning | Example in this project |
| --- | --- | --- |
| **Observed** | Directly seen or said in the moderated session | All five participants named a real person and an action. |
| **Survey result** | Direct response in the five-row Google Forms export | Ease of understanding averaged 4.0/5. |
| **Company reported** | A metric published by BeReal | BeReal publicly reported more than 40 million MAU and an audience that was 85% Gen Z. |
| **Third-party estimate** | A market estimate with an external methodology | The 16 million March 2025 MAU estimate. |
| **Research context** | Secondary or academic evidence used to frame the opportunity | Sensor Tower age distribution; McKinsey wellness research. |
| **Design hypothesis** | A proposed causal mechanism that still requires testing | A shared challenge may improve repeat participation. |
| **Not yet measured** | An outcome that the prototype and focus group cannot establish | Retention, reactivation, and MAU lift. |

### Claims the presentation must not make

- Do not say the feature increased or will definitely increase MAU.
- Do not say the Empty Room caused the platform's MAU trend.
- Do not say the focus group validated retention.
- Do not present mixed MAU sources as one audited, continuous dataset.
- Do not present the speculative “30–55% increase in MAU” or other early lift estimates as evidence. They were idea-stage hypotheses, not forecasts.
- Do not call Real-Life Challenges the highest RICE-scoring concept. It ranked third.
- Do not frame the feature primarily as wellness, fitness, or mental health. Connection is the product; wellness-related actions are one vehicle.
- Do not claim the Google Form asked whether the feature belonged on BeReal or whether participants would accept an invitation. Those conclusions came from the moderated conversation, not the final seven-question spreadsheet.

## 4. Project context

BeReal built its identity around one spontaneous, unfiltered moment a day. The product's core ritual reduced some forms of performance pressure through a random notification, reciprocal posting, dual-camera capture, a close-friend orientation, and minimal public metrics. Research also suggested a limitation: a single unplanned image does not always help people portray their lives accurately or build the relationships they want.

This project began with a retention question rather than a predetermined feature:

> What could give people a credible reason to reopen, contribute, and bring a close friend back into the experience without making ordinary life performative?

### Role and process

The Product Designer role covered:

- Research synthesis
- Product and audience framing
- Competitive and behavioral analysis
- Idea generation and prioritization
- Feature definition
- Interaction and interface design
- A six-screen MVP definition
- A 12-screen coded HTML prototype
- Validation planning, moderation, synthesis, and recommendations

The broad process was:

```text
Market and product signals
→ behavioral and audience research
→ problem framing
→ seven feature directions
→ RICE plus strategic-fit review
→ six-screen MVP
→ 12-screen coded prototype
→ moderated Zoom focus group
→ Google Forms survey
→ refinement plan
→ proposed behavioral beta
```

## 5. Problem framing

### 5.1 The primary product signal: participation and MAU pressure

The research assembled several points from different sources to describe a rise, a viral peak, and weaker participation momentum afterward.

| Date | MAU value used in the case study | Evidence type | Presentation note |
| --- | ---: | --- | --- |
| July 2021 | 0.92M | Third-party estimate | Early baseline. |
| July 2022 | 21.6M | Third-party estimate | Rapid growth before the peak. |
| August 2022 | 73.5M | Third-party estimate | Viral peak used in the research analysis. |
| June 2024 | 40M | Company reported | Not methodologically comparable with every external point. |
| March 2025 | 16M | Independent estimate | Directional only; methodology differs from the company figure. |

Annual download estimates used in the portfolio research:

| Year | Worldwide downloads | Status |
| --- | ---: | --- |
| 2022 | 93.5M | Third-party estimate |
| 2023 | 31.5M | Third-party estimate |
| 2024 | 12.7M | Third-party estimate |
| 2025 | approximately 6M | Estimate, not a final audited total |

### Required data caveat

The MAU points combine company reporting with third-party estimates, and they do not share one consistent methodology. A live source check in July 2026 found that BeReal's current public materials still describe the platform as having more than 40 million monthly active users and an audience that is approximately 85% Gen Z. The presentation should therefore use the historical chart to establish uncertainty and participation pressure, not to claim a precise percentage decline.

The safest spoken framing is:

> Multiple sources agree on a very large 2022 peak and a significant slowdown in downloads and growth afterward, but the exact size of the active audience varies by source. The design question is not to prove a single decline percentage. It is to create a stronger reason for repeat participation.

### 5.2 The behavioral gap: the Empty Room

MAU describes an outcome; it does not explain why someone does not return. The research identified a repeatable experience beneath the metric:

1. **Ordinary life is filtered out.** A routine day at work, at home, or running errands does not feel interesting enough to share.
2. **Participation becomes inconsistent.** The user ignores the prompt; friends do the same; the product feels repetitive.
3. **The graph becomes quieter.** There is less content to unlock and less expectation that someone meaningful will be present.
4. **The invitation becomes weak.** “Download this to see my daily photo” is less compelling than a specific activity between two people.
5. **Return value falls.** The user has fewer social reasons to reopen or contribute.

The feature does not remove the Empty Room by filling a feed with more content. It addresses the mechanism by giving two people a reason to show up for the same small action.

### 5.3 Design hypothesis

> How might BeReal rebuild recurring value between close friends without making ordinary life performative, so more people have a reason to invite, participate, and return?

The design hypothesis is:

> If an invitation contains a concrete shared action instead of a generic download request, a close friend may be more willing to join and contribute. If both people receive a private emotional payoff and a gentle reason to repeat, the loop may support reactivation and retention.

## 6. Audience and behavioral opportunity

### 6.1 Core audience and adjacent opportunity

The feature should not reposition BeReal away from its core audience.

| Audience role | Cohort | Product implication |
| --- | --- | --- |
| **Core audience** | Gen Z | Protect spontaneity, authenticity, privacy, reciprocal posting, and close-friend culture. |
| **Adjacent opportunity** | Millennials | Test whether a more purposeful invitation and a private shared ritual broaden relevance without adding pressure. |

Sensor Tower's January 2023 snapshot estimated that nearly 25% of BeReal users were ages 18–24, compared with 12% ages 25–34. This is useful context, but it is not a current census and does not prove demand for the feature.

### 6.2 Wellness and mental health as context, not product category

The audience research showed that younger consumers often understand wellness as a daily, personal practice. McKinsey's 2025 research describes Gen Z and millennials as disproportionately active in wellness and reports that younger people frequently connect mental wellbeing with sleep, fitness, socializing, and other everyday behaviors.

The portfolio also visualizes an older APA dataset from 2018:

| Measure | Gen Z | Millennials | Gen X | Boomers |
| --- | ---: | ---: | ---: | ---: |
| Rated mental health fair or poor | 27% | 15% | 13% | 7% |
| Received therapy or treatment | 37% | 35% | 26% | 22% |

These figures establish emotional context, not a product requirement. The presentation should explicitly state:

- Real-Life Challenges is not treatment.
- It should not make clinical claims.
- It should not require health, mood, sleep, medication, precise location, or biometric data.
- Small actions such as water, a walk, sunlight, a voice note, or a mood word are prompts for connection, not metrics for optimization.

### 6.3 Product principles derived from the research

The intervention should feel:

- Small
- Private
- Human
- Optional
- Close-friend focused
- Playful without competition
- Emotional without being clinical
- Authentic without demanding exposure

It should not feel like:

- Strava
- Duolingo
- A public leaderboard
- A productivity dashboard
- A mental health treatment tool
- A performance feed
- A copy of Instagram, Facebook, or a conventional social graph

## 7. From research to feature direction

### 7.1 Existing retention patterns studied

Early product analysis examined the mechanisms already supporting return behavior:

- The random daily notification creates a recurring trigger.
- The two-minute capture window protects spontaneity.
- Dual-camera capture lowers production expectations and shows context.
- “Post before you scroll” creates reciprocity.
- Memories turn ephemeral participation into a personal archive.
- Close-friend sharing and lightweight reactions make the experience relational.
- Locket's home-screen widget showed the value of persistent, glanceable presence from a specific person.

The goal was not to copy those patterns. It was to understand why they work and identify what was still missing: a user-generated reason for two people to return around the same intention.

### 7.2 Seven concepts before prioritization

| # | Direction | Problem it addressed | Core hypothesis |
| --- | --- | --- | --- |
| 1 | Clarity Layer | Unfamiliar mechanics and onboarding opacity | Better explanation may reduce comprehension friction. |
| 2 | Real-Life Challenges | No shared action loop beyond the daily post | A concrete pact may create a new reason to invite and return. |
| 3 | Home Screen Widget | Opening friction and low visibility | A glanceable update may create more frequent touchpoints. |
| 4 | Streak Proof | Confusion and distrust around progress | Transparent rules and recovery may protect trust. |
| 5 | Shared Moments | Posting can feel lonely or disconnected | A scheduled private moment may deepen a relationship. |
| 6 | Life Timeline | Ephemeral moments lack a lasting artifact | A timeline or yearbook may build long-term attachment. |
| 7 | Attestation | Authenticity is harder to trust in generated-content environments | Friend verification may reinforce trust. |

The original idea table attached speculative impact ranges to these concepts. Those numbers were brainstorming assumptions. They must not be reused as forecasts or outcomes.

### 7.3 RICE analysis

| Rank | Feature | Reach | Impact | Confidence | Effort | RICE score |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | Clarity Layer | 75 | 2.0 | 0.85 | 1.5 | 85.0 |
| 2 | BeReal Widget | 60 | 2.0 | 0.80 | 2.0 | 48.0 |
| 3 | **Real-Life Challenges** | 50 | 2.0 | 0.75 | 2.5 | **30.0** |
| 4 | Shared Moments | 45 | 1.5 | 0.75 | 2.0 | 25.3 |
| 5 | Streak Proof | 50 | 1.5 | 0.70 | 2.5 | 21.0 |
| 6 | Life Timeline | 30 | 1.5 | 0.65 | 3.5 | 8.4 |
| 7 | Attestation | 25 | 1.0 | 0.50 | 3.0 | 4.2 |

RICE was used to expose assumptions, not to select an automatic winner.

- The **Clarity Layer** scored highest but operated mainly as a UX refinement and could conflict with deliberately minimal product mechanics.
- The **Widget** reduced friction but risked adapting a familiar pattern without creating a BeReal-specific reason to exist.
- **Real-Life Challenges** scored lower but directly changed the invitation and participation loop identified in the research.

The decision therefore combined RICE with strategic fit, differentiation, research relevance, and protection of the product's values.

### 7.4 The critical concept transformation

The first Challenges idea included fitness-hardware integrations and leaderboards. That version was intentionally rejected because it moved the concept toward measurement, public comparison, and patterns already owned by fitness products.

The concept was reframed:

| Early direction | Final direction |
| --- | --- |
| Health and fitness challenge | Small real-life pact |
| Hardware integration | Native photo, video, voice note, or check-in |
| Leaderboard | One close friend or a small private group |
| Performance | Presence |
| Score | Shared moment |
| Streak | Gentle continuation |
| Public proof | Mutual reveal |
| Dashboard | Private memory vault |

This transformation is central to the presentation. It demonstrates that the final feature was not the first idea; it was the result of evidence and product-boundary decisions.

## 8. Feature definition

### 8.1 Product definition

Real-Life Challenges is a lightweight system of small real-life pacts between close friends, partners, siblings, or a small private group. Participants choose one action, agree on a short rhythm, show proof in a BeReal-native format, unlock each other's moments through reciprocity, and save the completed experience as a private shared memory.

The challenge is a pretext for presence. The relationship is the product.

### 8.2 Closed loop

```text
1. Choose something small
2. Invite someone close
3. Both show up
4. Reveal each other's moment
5. Save the shared memory
6. Decide whether to begin another pact
```

### 8.3 Challenge families

| Family | Purpose | Example prompts |
| --- | --- | --- |
| Movement | Movement without performance pressure | Walk, stretch, take the stairs, sunlight break |
| Mood | Light emotional expression without clinical framing | Mood word, one-sentence check-in, one thing I survived today |
| Care | Small stabilizing actions | Water, a real meal, clean one corner, wind down |
| Connection | Rituals centered on a relationship | Same-sky photo, voice note, honest question |
| Outside | Prompts that interrupt isolated scrolling | Touch grass, sit outside, notice one thing |

Participants later suggested a Creative family and a reading prompt. These are research inputs for the next round, not committed MVP scope.

### 8.4 Proof types

The design materials explore:

- Dual-camera photo
- Video
- Voice note
- Check-in

The six-screen MVP definition was intentionally narrower, with photo or dual-camera, voice note, and check-in as the recommended first proof types.

### 8.5 Non-goals and guardrails

- No public leaderboard
- No scores
- No streak loss
- No public penalty
- No required health or fitness integration
- No clinical mental health claims
- No beauty filters or polished feed
- No sensitive data by default
- No infinite feed as the reward
- No shame-based failure state

### 8.6 User stories

1. As a BeReal user, I want to start a small challenge with someone close so we can stay connected through everyday actions.
2. I want a family and action that fits my life so the feature does not feel fitness-only.
3. I want reminders to feel like a person, not a generic app notification.
4. I want to see my partner's contribution after I show up so the exchange feels reciprocal.
5. I want a quiet recap after completion so the shared moments retain emotional value.

### 8.7 Hypothesis and measurement ladder

| Stage | Behavior to measure | What it would indicate |
| --- | --- | --- |
| Invite | Invite sent and opened | The action is concrete enough to share. |
| Accept | Invitation accepted | The receiver understands and wants the pact. |
| First contribution | Both complete the first action | The setup converts into behavior. |
| Repeat contribution | The pair returns on another day | The reminder and relationship create short-term return. |
| Second challenge | Another challenge begins within seven days | The value extends beyond novelty. |
| Reactivation | A lapsed user becomes active again | The feature may recover participation. |
| 30-day retention | Exposed users retain more than a comparable group | The loop may create durable return value. |
| MAU contribution | Sustained behavior appears at scale | The feature may influence the primary business metric. |

Only the first conceptual links were explored in the focus group. The behavioral measures require an instrumented beta.

## 9. Prototype structure and screen-to-story mapping

The current HTML contains a visual preview plus 12 interactive feature screens. Only the Care path is wired through the complete end-to-end demo; the other families allow exploration and then route to the invitation step.

The future presentation should keep the phone interactive while using the adjacent narrative panel to explain four things for each screen:

1. What the user sees
2. Why the screen exists
3. Which research insight informed it
4. What validation changed or challenged

| Prototype screen | Story purpose | Research connection | Validation or revision note |
| --- | --- | --- | --- |
| **01. Empty state** | Introduce the invitation opportunity | A quiet graph needs a specific reason to begin | Avoid saying the screen “solves” the Empty Room. It tests a response to it. |
| **02. Challenge families** | Show that ordinary actions can take different forms | Wellness context without making fitness the product | Participants understood the categories; Creative and reading were suggested additions. |
| **03. Setup** | Define action, partner, duration, and proof | Agency and small private scope | The one-year duration felt intimidating. The receiver also needs negotiation agency. |
| **04. iMessage invite** | Replace “download this” with “do this with me” | Direct response to the invitation weakness within the Empty Room | Nonusers said the relationship could motivate download, but copy should make “just you and me” clearer. |
| **05. Micro-onboarding** | Preserve momentum while explaining the pact | Simplicity and comprehension | The concept was understood, but one nonuser initially needed clarity about who Maya was. |
| **06. Day 1 capture** | Reuse native BeReal behavior | Dual camera and reciprocal posting | Participants recognized it as platform-native. |
| **07. Success and unlock** | Make the friend's moment the reward | Reciprocity instead of scores | “No score” became a major trust signal. |
| **08. Friend check-in** | Deliver the emotional payoff | The friend, not the app, is the protagonist | The private one-to-one reveal distinguished the concept from a feed. |
| **09. Notification and widget** | Create a gentle return cue | Repeat participation may contribute to retention | “You up?” felt human but had an unintended connotation; long-term pressure remains untested. |
| **10. Final capture** | Show progress without a public metric | Guided completion | The experience still needs a missed-day branch before progress can be considered kind. |
| **11. Celebration** | Recognize completion | A small win can be playful without a leaderboard | Avoid over-emphasizing liters or quantified performance; recognition should remain relational. |
| **12. Memory vault** | Convert proof into a private shared artifact | Memories can build attachment over time | Four participants independently described the ending as an album, memory box, private space, or something sweet. |

### 9.1 Current prototype inconsistencies to resolve in a later code edit

These are not changes made by this document. They are implementation notes for the next task.

#### Must resolve before a formal presentation

1. **Add or at least storyboard a missed-day state.** This was the most important unrepresented risk in the validation.
2. **Reframe overclaiming.** The annotation “solves the Empty Room problem” should become “addresses” or “tests a response to” the Empty Room mechanism.
3. **Correct evidence labeling.** Moderated-discussion outcomes and Google Forms results must remain separate.
4. **Standardize people and roles.** The flow uses Noah and Maya in ways that may make sender, receiver, and participant identities unclear.
5. **Review the one-year duration.** It contradicts the low-pressure promise and was explicitly flagged.
6. **Review tracker-like metrics.** The celebration shows “1.5L per day,” and the vault uses “3 days real in a row.” Both can drift toward the measurement language the concept intentionally removed.
7. **Review “you up?” copy.** It tested as playful but has an unintended sexual or late-night connotation in some English-speaking contexts.
8. **Increase legibility.** Dark surfaces and small type were flagged by the oldest participant and should be tested for contrast and size.
9. **Replace weak source links.** The current annotation panel uses broad or secondary links. Use the verified source list in this document.
10. **State simulation boundaries.** The current HTML is a prototype without backend, real invitations, real capture, or real-time widget behavior.

#### Valuable next-round concepts

- Receiver can propose a different action or duration before accepting.
- User can run more than one challenge at a time.
- Invitation copy variants for current users and nonusers.
- A Creative challenge family.
- Lighter or higher-contrast visual mode.
- A kind recovery message such as “tomorrow we continue.”

## 10. Validation methodology

### 10.1 What was tested

The validation was designed to answer five practical questions:

1. Does the concept feel like a natural extension of BeReal or like a fitness, productivity, or therapy product?
2. Does the external invitation work as a relationship-based pitch?
3. Does “no streaks, no scores” create trust?
4. Do the five challenge families feel relevant?
5. Where does the flow create confusion, friction, or pressure?

### 10.2 Research operations

- **Recruitment and project operations:** User Interviews
- **Planning support:** User Interviews' internal AI-assisted project setup helped draft the participant listing, preparation instructions, prototype access, and survey handoff. The researcher finalized the criteria and language.
- **Session platform:** Zoom
- **Format:** Remote moderated focus group, cameras on
- **Participant-facing duration:** 45-minute online focus group in the recruitment listing
- **Written plan:** 40 minutes
- **Recorded session:** approximately 37 minutes, from 10:00 to 10:37 in the transcript
- **Prototype:** 12-screen interactive HTML flow
- **Structured follow-up:** Seven-question Google Forms survey
- **Participants:** Five people, ages 24–38, across Atlanta, Buenos Aires, Mexico City, Bogotá, and London
- **Incentive:** USD $30 per completed participant, USD $150 total
- **Analysis sources:** Zoom transcript, survey export, and coded synthesis

Compensation was tied to attendance and completion, not positive feedback.

### 10.3 Planned versus completed sample

The focus group plan proposed inviting seven participants with a target mix of active, occasional, and nonusers. The completed group contained five participants:

| Participant | Age | Location | BeReal status | Research contribution |
| --- | ---: | --- | --- | --- |
| Aisha | 31 | Atlanta | Daily user | Core-user fit, emotional payoff, multi-challenge demand |
| Tomás | 26 | Buenos Aires | Daily user | Anti-streak trust, long-term pressure, missed-day risk |
| Sebastián | 24 | Mexico City | Irregular user | Platform fit, relationship framing, receiver negotiation |
| Valentina | 28 | Bogotá | Former user | Invitation clarity, Creative family, kinder recovery |
| Miriam | 38 | London | Never used BeReal | Newcomer comprehension, accessibility, cross-market copy |

Recruitment screenshots are evidence of the User Interviews workflow, not a definitive record of the final sample criteria. One screenshot shows an early U.S., age-26-or-younger configuration, while the completed group was international and included participants through age 38. The presentation should use the completed participant table as the final sample description.

### 10.4 Session structure

1. Welcome, consent, and no-right-answer framing
2. Short warm-up on social media habits and BeReal behavior
3. Independent prototype exploration with think-aloud behavior
4. Moderated discussion across comprehension, relevance, invitation, tone, and pressure
5. Individual Google Forms survey with no group discussion during completion
6. Close and incentive follow-through

### 10.5 Methodological boundary

The session assessed concept desirability, comprehension, perceived product fit, emotional relevance, and anticipated pressure. It did not observe real invitations between existing friends, multi-day behavior, retention, or changes in MAU.

## 11. Qualitative findings from the Zoom transcript

The portfolio's qualitative chart codes the transcript across six decision areas. Each participant is counted once per finding. Counts describe breadth across people, not how often a phrase was repeated.

| Finding | Direct voices | Qualified or affirmed | Interpretation |
| --- | ---: | ---: | --- |
| The friend is the protagonist in acquisition | 5/5 | 0 | All five accepted the relationship-first logic; both nonusers said they could consider downloading for a close friend. |
| A real person appeared before a feature benefit | 5/5 | 0 | Every participant immediately named one person and one action. |
| Platform fit | 3/5 | 2/5 | Current users identified BeReal's camera and spirit; newcomers said it felt distinct from fitness and Instagram. |
| Private-vault emotional payoff | 4/5 | 0 | Four people independently described the ending as an album, memory box, private space, or something sweet. |
| “No score” as a trust signal | 3/5 | 0 | Three participants singled it out; one linked it to abandoning a 200-day Duolingo streak. |
| Missed day as the primary risk | 3/5 | 2/5 | Three raised failure directly; the other two affirmed a kinder “tomorrow we continue” response. |

### Strongest qualitative insight

All five participants named a specific person and a specific challenge within seconds:

- Aisha: Keisha in Toronto; water and same sky
- Tomás: his sister in Córdoba; walking
- Sebastián: his friend in Spain; voice note and “one thing I survived today”
- Valentina: her mother in Cali; water or sunlight
- Miriam: Chidinma in Lagos; same sky

This is the strongest early evidence of social specificity. It shows that the concept mapped quickly to existing relationships. It does not show that those people would accept or that the pair would continue over time.

### Participant language worth preserving

Use short quotes sparingly and let each quote perform one job.

> “The app is not the protagonist. The friend is the protagonist.”

Use for the acquisition and invitation pivot.

> “Accountability, but soft.”

Use as the participant-generated value proposition.

> “No score... is the reason I would try it.”

Use for the trust guardrail.

> “Tomorrow we continue.”

Use for the missed-day design direction.

> “Two skies, one album.”

Use for the emotional closing and memory-vault payoff.

### Tension to preserve

The relationship is both the value and the risk. A friend waiting can motivate participation more meaningfully than a generic app prompt, but it can also create interpersonal guilt. No notification copy can remove that tension entirely. The next design must demonstrate kindness when someone misses a day.

## 12. Quantitative findings from the Google Forms survey

The actual spreadsheet contains five rows and seven questions. The following table should replace any simplified chart that mixes survey and discussion results.

| Survey question | Raw responses | Summary |
| --- | --- | --- |
| Ease of understanding each screen, 1–5 | 4, 5, 3, 5, 3 | **Average 4.0/5** |
| Likelihood of inviting someone who does not use BeReal, 1–5 | 4, 4, 2, 4, 4 | **Average 3.6/5** |
| Did the feature feel like it asked too much, 1–5 | 1, 1, 1, 2, 1 | **Average 1.2/5**, indicating low perceived burden in this session |
| First challenge family and person | Care, Mood, Connection, Connection, Care | Care 2, Connection 2, Mood 1 |
| What would be required for actual use | Creative family; missed-day behavior and negotiation; multiple challenges; kind failure; clearer invitation | Five concrete refinement directions |
| Would it create more connection? | Yes, Yes, Yes, Yes, Maybe | **4 Yes, 1 Maybe** |
| Likelihood of opening BeReal more often, 1–5 | 3, 4, 5, 3, 3 | **Average 3.6/5** |

### Survey interpretation

- Comprehension was positive but not perfect. The two scores of 3 align with accessibility and clarity concerns.
- Invitation likelihood was favorable but mixed. One score of 2 is important counterevidence and should remain visible.
- Perceived burden was low during a short prototype session. This cannot predict pressure on Day 20.
- Connection received the clearest structured signal: four Yes and one Maybe.
- Opening-more-often intent averaged 3.6/5. This is stated intent, not measured behavior.

### Important source correction

The following were findings from the group conversation, not questions in the final spreadsheet:

- “5/5 said the feature belongs on BeReal.”
- “5/5 would accept the invitation.”

They may remain in the presentation, but they must be labeled **moderated discussion** rather than **Google Forms survey**.

Respondents should be anonymized as R1–R5 in charts. The order is visual only. Do not map survey timestamps directly to names because the transcript completion timestamps and spreadsheet row timestamps are not fully consistent.

## 13. What validation supports and what it does not

### Supported for refinement

- The relationship-first concept was understood.
- The five families covered multiple meaningful use cases.
- Current users recognized the platform's spirit.
- Newcomers did not interpret the concept as Instagram or a fitness app.
- The invitation could provide a more concrete reason to join than “see my photos.”
- The absence of scores and streaks protected trust.
- The memory vault created an emotional, private payoff.
- The principal design risk is the missed-day experience.

### Not supported yet

- Real invitation acceptance in the market
- Multi-day completion
- Repeat challenges
- Reactivation of lapsed users
- 30-day retention
- Causal lift in MAU
- Scalability beyond five participants
- Safety and pressure over longer challenge durations
- Accessibility across a representative age range

### Decision after validation

**Refine, then test behavior.** The evidence supports continuing the concept without a full redesign, while resolving missed-day behavior, invitation clarity, receiver agency, duration pressure, and accessibility.

## 14. Recommended presentation sequence

This is a narrative sequence, not a fixed slide count. A full formal presentation could use 12–15 minutes. A shorter version can combine adjacent beats without changing their order.

### Beat 1: Cold open, “ordinary does not mean meaningless”

- **Purpose:** Establish emotional relevance before business data.
- **Content:** A routine day may not look post-worthy, but it can still matter to one person.
- **Visual:** A quiet ordinary moment, followed by the empty-state phone.
- **Speaker tone:** Reflective and restrained.
- **Transition:** “When both people make the same decision not to post, a product problem begins.”
- **Sources:** Academic authenticity research; problem framing in the case study.

### Beat 2: Product pressure

- **Purpose:** Show why the problem matters to the business.
- **Content:** Viral peak, mixed later MAU estimates, and falling annual downloads.
- **Visual:** A clearly labeled, split-methodology timeline rather than one authoritative line.
- **Speaker tone:** Precise; acknowledge uncertainty.
- **Transition:** “The metric tells us participation weakened. It does not tell us what experience sits underneath it.”
- **Sources:** Research Analysis PDF; official BeReal reporting; third-party estimates.

### Beat 3: The Empty Room mechanism

- **Purpose:** Move from business outcome to behavioral gap.
- **Content:** Ordinary life is filtered out → participation becomes quieter → the graph loses value → invitations weaken.
- **Visual:** Four-stage mechanism, not another growth chart.
- **Speaker tone:** Human, not accusatory.
- **Transition:** “The opportunity was not to manufacture more content. It was to give two people a reason to participate together.”
- **Sources:** Academic and secondary research; case-study synthesis.

### Beat 4: Audience and guardrails

- **Purpose:** Define whom the feature must protect and whom it may include.
- **Content:** Gen Z core; millennials adjacent; everyday wellness context; no medical claim.
- **Visual:** Core versus adjacent audience cards and a small research note.
- **Speaker tone:** Inclusive and non-clinical.
- **Transition:** “This narrowed the design language: presence, not performance.”
- **Sources:** Sensor Tower, McKinsey, APA, academic paper.

### Beat 5: Seven possibilities

- **Purpose:** Prove that the solution was not predetermined.
- **Content:** The seven feature directions and the problem each addressed.
- **Visual:** Compact option landscape.
- **Speaker tone:** Analytical.
- **Transition:** “Scoring clarified assumptions, but score alone was not the product decision.”
- **Sources:** Feature Ideas Table; RICE analysis.

### Beat 6: Why the third-ranked concept advanced

- **Purpose:** Explain RICE plus strategic fit.
- **Content:** Clarity scored 85, Widget 48, Challenges 30; Challenges most directly changed the invitation loop.
- **Visual:** Ranked RICE table with Challenges highlighted and a strategic-fit layer.
- **Speaker tone:** Transparent. Do not pretend RICE crowned the winner.
- **Transition:** “The first version was still wrong.”
- **Sources:** RICE PDF; feature idea table.

### Beat 7: From tracker to relationship

- **Purpose:** Show design judgment and concept evolution.
- **Content:** Remove fitness hardware, leaderboard, score, public comparison, and streak loss.
- **Visual:** Before-versus-after transformation table.
- **Speaker tone:** Decisive.
- **Transition:** “Once the relationship became the product, the loop became simple.”
- **Sources:** Brainstorm, PRD, feature definition board.

### Beat 8: The feature loop

- **Purpose:** Explain the system before the detailed demo.
- **Content:** Choose → invite → show up → reveal → remember → repeat.
- **Visual:** Six-node closed loop.
- **Speaker tone:** Clear and technical.
- **Transition:** “The prototype makes each step visible.”
- **Sources:** Feature proposal; PRD; user stories.

### Beat 9: Interactive prototype walkthrough

- **Purpose:** Let the audience experience the concept.
- **Content:** Use the 12-screen mapping in Section 9.
- **Visual:** Sticky phone on one side; concise intent and evidence on the other.
- **Speaker tone:** Demonstrative. Avoid reading every annotation.
- **Transition:** “A plausible loop is not evidence. We needed to see how people interpreted it.”
- **Sources:** `index.html`; feature board.

### Beat 10: Validation design

- **Purpose:** Establish credibility before results.
- **Content:** User Interviews recruitment and planning, Zoom moderation, five participants, Google Forms, $30 incentive, and methodological boundaries.
- **Visual:** Four-step operations flow and three evidence cards.
- **Speaker tone:** Factual.
- **Transition:** “The conversation explained why; the survey showed how consistently.”
- **Sources:** Focus group plan, discussion guide, User Interviews screenshots, transcript, survey.

### Beat 11: What the conversation revealed

- **Purpose:** Present the qualitative evidence.
- **Content:** Six coded findings; all five naming a person; friend as protagonist; no score; missed day.
- **Visual:** Participant-by-finding matrix with readable labels.
- **Speaker tone:** Let two or three short participant quotes carry emotion.
- **Transition:** “Those stories were followed by five individual survey records.”
- **Sources:** Transcript; test summary; portfolio coding.

### Beat 12: What the survey showed

- **Purpose:** Present structured evidence without overstating n=5.
- **Content:** The five numeric/structured outcomes from Section 12, including the lower invitation score and the 3.6 open-more-often average.
- **Visual:** One consistent chart system with all actual survey questions represented.
- **Speaker tone:** Balanced.
- **Transition:** “Together, the two evidence layers support refinement, not a launch claim.”
- **Sources:** `Real Life Challenge (Responses).xlsx`.

### Beat 13: The unresolved moment

- **Purpose:** Show that validation changed the work.
- **Content:** What happens when one friend misses a day?
- **Visual:** An intentionally unfinished state or “tomorrow we continue” concept.
- **Speaker tone:** Honest and empathetic.
- **Transition:** “That is the next screen to design and the first behavior to retest.”
- **Sources:** Transcript and survey open responses.

### Beat 14: Measurement and next step

- **Purpose:** Connect the validated mechanism back to MAU without claiming causality.
- **Content:** Four-week instrumented beta; exposed versus unexposed comparison; invitation, completion, second challenge, reactivation, and 30-day retention.
- **Visual:** Measurement ladder.
- **Speaker tone:** Technical and disciplined.
- **Transition:** “The concept earned a behavioral test, not a victory lap.”
- **Sources:** PRD metrics; portfolio outcome and next-step sections.

### Beat 15: Emotional close

- **Purpose:** Return to the human value.
- **Content:** The strongest early signal was that every participant immediately had a person in mind.
- **Visual:** Two skies or the private memory vault.
- **Speaker tone:** Warm, not sentimentalized.
- **Closing line:** “The feature does not ask whether your day is impressive. It asks whether there is someone you want to show up with.”
- **Sources:** Transcript; validation synthesis.

## 15. Future HTML content architecture

### 15.1 Recommended structure

The prototype should become a guided story with three modes.

#### Mode A: Research prelude

Full-width or wide split sections before the interactive phone:

1. Human context
2. Product signal
3. Empty Room mechanism
4. Audience and guardrails
5. Idea landscape and RICE
6. Final hypothesis

#### Mode B: Sticky prototype walkthrough

Desktop layout:

```text
┌───────────────────────────────┬──────────────────────────┐
│ Narrative and evidence panel  │ Sticky interactive phone │
│                               │                          │
│ • Screen purpose              │ Current prototype state  │
│ • Research link               │                          │
│ • Design decision             │                          │
│ • Validation note             │                          │
│ • Source                      │                          │
└───────────────────────────────┴──────────────────────────┘
```

The phone should remain stable while the narrative changes. The explanatory panel should be large enough for 18px body text and should avoid the current 340px constraint if it causes dense wrapping.

#### Mode C: Evidence and decision

After the walkthrough:

1. Validation method
2. Qualitative findings
3. Survey findings
4. What is supported and not supported
5. Missed-day design problem
6. Beta measurement ladder
7. Emotional close

### 15.2 Progressive disclosure

Do not place every data point beside every screen. Each panel should contain:

- One message headline
- One short explanatory paragraph
- One evidence label
- One optional “view source” or “details” expansion
- One transition cue

Long tables and full source notes belong in expandable evidence drawers or an appendix.

### 15.3 Suggested content data model

When the HTML is revised, store narrative content separately from screen markup so it can be edited without touching the phone interface.

```js
{
  id: "invite",
  prototypeScreen: "imessage",
  narrativeBeat: 4,
  eyebrow: "Beyond the Empty Room",
  title: "An invitation with a reason",
  body: "A close friend is invited into a specific action, not a generic download.",
  evidenceType: "design hypothesis",
  validation: "Both nonusers said the relationship could motivate download; copy still needs refinement.",
  sourceIds: ["S11", "S13", "S14"]
}
```

### 15.4 Accessibility requirements for the next build

- Body text beside the prototype should be at least 18px on desktop and 16px on small screens.
- Maintain WCAG AA contrast for all body text and controls.
- Never place essential labels inside small decorative circles.
- Charts require text summaries and visible legends.
- The phone must remain keyboard navigable.
- Screen changes should update an `aria-live` region without stealing scroll position.
- Avoid hover-only disclosure; touch, keyboard, and click must reach the same content.
- Respect reduced-motion preferences.
- On narrow screens, stack narrative before the phone and preserve the presentation order.
- Do not use blur as the only confidentiality control if an external version is later created.

## 16. Data and content quality checks before presenting

Use this checklist after the HTML is revised.

- [ ] MAU points are labeled by source type.
- [ ] No precise decline percentage is stated across mixed methodologies.
- [ ] 2025 downloads are labeled as an estimate.
- [ ] RICE score is shown accurately and Challenges is identified as third-ranked.
- [ ] Speculative feature-lift percentages are omitted or clearly labeled as early assumptions.
- [ ] Gen Z is presented as the core audience and millennials as adjacent, not as a replacement audience.
- [ ] Wellness and mental health research is framed as context, not proof of demand.
- [ ] The feature is defined as connection, not tracking.
- [ ] The prototype is identified as a simulation.
- [ ] The six-screen MVP and 12-screen coded prototype are not confused.
- [ ] Participant-facing 45 minutes, planned 40 minutes, and recorded 37 minutes are reconciled.
- [ ] The final sample is five participants ages 24–38 across five locations.
- [ ] The $30 incentive and $150 total are stated accurately.
- [ ] Qualitative and survey findings are visually separate.
- [ ] All seven Google Forms questions are represented if the survey is shown in full.
- [ ] “Belongs” and “accepts invitation” are labeled as moderated-discussion findings.
- [ ] Ease average is 4.0/5.
- [ ] Invite-nonuser likelihood average is 3.6/5.
- [ ] Perceived-burden average is 1.2/5, with scale direction explained.
- [ ] Connection result is four Yes and one Maybe.
- [ ] Open-more-often intent average is 3.6/5 and is not presented as behavior.
- [ ] The missed-day state is acknowledged as unresolved.
- [ ] The closing does not claim retention or MAU improvement.

## 17. Source map

The paths below are the primary evidence locations for the next editing session.

### S1. Market and product research

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 1/BeReal — Research Analysis.pdf`

Use for the growth arc, company history, audience composition, mixed-source MAU series, annual downloads, and competitive scale. Preserve the methodology caveat.

### S2. Initial problem and opportunity note

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 1/BeReal — PM Problem Statement & Opportunity Note.pdf`

Use as evidence of the earlier millennial-retention framing. Do not treat its original problem statement as the final case-study framing; the portfolio later elevated MAU as the primary product problem and Empty Room as the behavioral mechanism.

### S3. Retention analysis

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 2/BeReal_Retention_Analysis.docx`

Use for Memories, the daily notification, and the two-minute window as return mechanisms.

### S4. BeReal and Locket feature consolidation

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 2/Feature_Consolidation.docx`

Use for reciprocity, close-friend sharing, widget presence, and memory value.

### S5. Seven feature directions

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 3/BeReal_Feature_Ideas_Table.docx`

Use for the idea landscape and the original tracker-like Challenges concept. Treat all projected MAU impact numbers as unvalidated brainstorming assumptions.

### S6. RICE analysis

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 3/BeReal_RICE_Analysis_Real_Life_Challenges.pdf`

Use for exact RICE inputs, rankings, and selection rationale.

### S7. Challenge brainstorm and product boundaries

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 3/Challenges_Brainstorm.docx`

Use for five families, proof types, sensitive-data risks, tone principles, the tracker-versus-connection distinction, and early flow options.

### S8. PRD

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 3/PRD_Lite.docx`

Use for problem, target user, primary and secondary metrics, assumptions, non-goals, and brand guardrails.

### S9. User stories and acceptance criteria

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 3/User_Stories_Acceptance_Criteria.docx`

Use for feature requirements and MVP prioritization.

### S10. Feature definition board

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 3/Real-Life Challenges — BeReal Feature Proposal.pdf`

Use for the six-screen MVP, closed loop, UI states, and state variations.

### S11. Focus group plan

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 4/focus-group-plan.docx`

Use for study objectives, participant mix, planned flow, core hypotheses, and moderation guardrails.

### S12. Discussion guide

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 4/discussion-guide.docx`

Use for exact qualitative questions about interest, usability, value, pressure, platform fit, and intended impact.

### S13. Focus group transcript

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 4/transcript_focus_group_real_life_challenges.txt`

Use as the primary source for quotes, observed reactions, participant profiles, and qualitative coding. Exclude moderator statements from evidence counts.

### S14. Google Forms response export

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 4/Real Life Challenge (Responses).xlsx`

Use as the only primary source for structured survey counts and averages.

### S15. Test summary

`/Users/juliocoraspe/Library/CloudStorage/GoogleDrive-juliocoraspe@gmail.com/My Drive/BeReal Externship/project 4/test_summary_report_bereal.docx`

Use as a secondary synthesis of the transcript and survey. When it conflicts with S13 or S14, use the primary source.

### S16. Current portfolio narrative and chart coding

`/Users/juliocoraspe/Desktop/UX UI Portfolio/src/app/components/RealLifeCaseStudy.tsx`

Use for the current public narrative, exact section order, qualitative coding matrix, and measurement boundaries. Correct the survey-source mixing described in Section 12 when reusing its outcome chart.

### S17. Current standalone prototype

`/Users/juliocoraspe/Desktop/RealLife challenge video:code/bereal-prototype/index.html`

Use for the interactive 12-screen flow and current annotation system. This is the file to modify in the next implementation task.

### S18. Validation evidence images

Unredacted internal assets:

```text
/Users/juliocoraspe/Desktop/UX UI Portfolio/src/assets/images/RealLife_validation-recruitment.png
/Users/juliocoraspe/Desktop/UX UI Portfolio/src/assets/images/RealLife_validation-communications.png
/Users/juliocoraspe/Desktop/UX UI Portfolio/src/assets/images/RealLife_validation-ai-planning.png
```

Use as visual evidence of recruitment, participant communication, and AI-assisted project setup. Do not treat visible draft criteria as the final completed sample.

### S19. Feature-definition and research visuals

```text
/Users/juliocoraspe/Desktop/UX UI Portfolio/src/assets/images/RealLife_feature-definition.png
/Users/juliocoraspe/Desktop/UX UI Portfolio/src/assets/documents/RealLife_research-analysis.pdf
/Users/juliocoraspe/Desktop/UX UI Portfolio/src/assets/images/RealLife_research-analysis-redacted.jpg
```

Use unredacted assets internally. The redacted preview exists for the public portfolio only.

## 18. External source list

These links support the research context. They should remain visible in an evidence drawer or appendix rather than interrupting the main story.

- BeReal, “BeReal Launches U.S. Advertising”: https://bereal.com/news/bereal-launches-u.s.-advertising
- BeReal audience page: https://bereal.com/ads/audience
- Sensor Tower, “BeReal Data Snapshot”: https://sensortower.com/blog/bereal-data-snapshot
- McKinsey, “The $2 trillion global wellness market gets a millennial and Gen Z glow-up”: https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights/future-of-wellness-trends
- American Psychological Association, 2018 Stress in America Gen Z release: https://www.apa.org/news/press/releases/2018/10/generation-z-stressed
- Kim et al., “Sharing, Not Showing Off”: https://arxiv.org/abs/2408.02883
- Gallup, “Young Adults in U.S. Drinking Less Than in Prior Decades”: https://news.gallup.com/poll/509690/young-adults-drinking-less-prior-decades.aspx
- Pew Research Center, “Americans' Social Media Use 2025”: https://www.pewresearch.org/internet/2025/11/20/americans-social-media-use-2025/
- Business of Apps, BeReal statistics: https://www.businessofapps.com/data/bereal-statistics/

## 19. Final narrative summary for the next editor

The presentation must preserve three levels of truth:

1. **Business truth:** The feature is intended to influence the behaviors beneath repeat participation and MAU.
2. **Behavioral truth:** The Empty Room is the clearest design mechanism in the research, because ordinary life, quiet friends, and weak invitations reduce return value.
3. **Human truth:** The focus group did not respond most strongly to a metric. They responded by naming a person.

The feature should therefore be presented neither as a wellness tool nor as a growth hack. It is a relationship loop with a measurable product hypothesis.

The complete story is:

> BeReal asks people to share one real moment a day, but ordinary life can feel too uneventful to post and a quiet social graph provides little reason to return. Research reframed that experience as an actionable layer beneath MAU pressure. Seven directions were explored; Real-Life Challenges did not win RICE, but it most directly changed the invitation loop. The concept was stripped of hardware, leaderboards, scores, and streaks until the relationship became the product. A 12-screen prototype then tested whether two people could choose a small action, invite, contribute, reveal, and remember. Five participants understood the concept, immediately named someone close, and described the value as soft accountability. The survey showed favorable but mixed intent, and the session exposed the decisive unresolved moment: what happens when a person misses a day. The feature has earned refinement and a behavioral beta. It has not yet earned a retention or MAU claim.

That is the causal line the next HTML revision should make visible from the first sentence to the final screen.
