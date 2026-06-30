# AI Engine Design Document

## Project: AI DSA Mentor

**Version:** 1.0  
**Status:** Draft  
**Date:** 30 June 2026

---

# 1. Purpose

The AI Engine is the intelligence layer of AI DSA Mentor.

Unlike traditional DSA trackers that simply store progress, the AI Engine continuously analyzes a user's learning history, identifies strengths and weaknesses, predicts future performance, and generates personalized recommendations.

The goal is to provide mentorship rather than simple automation.

---

# 2. Core Objectives

The AI Engine should be able to:

- Understand each learner's progress.
- Recommend the next best problem.
- Detect weak concepts.
- Identify recurring mistakes.
- Build adaptive learning paths.
- Explain recommendations.
- Estimate interview readiness.
- Encourage long-term consistency.

---

# 3. AI Architecture

```
                  User Activity
                        │
                        ▼
              Data Collection Layer
                        │
                        ▼
              Learning Analytics Engine
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
Recommendation     Performance      Revision Engine
Engine             Analyzer
      │                 │
      └────────────┬────┘
                   ▼
           Large Language Model
                   │
                   ▼
            Personalized Response
```

---

# 4. AI Modules

The AI Engine is divided into independent modules.

## 4.1 Recommendation Engine

Purpose:

Recommend what the learner should study next.

Inputs:

- Solved problems
- Weak topics
- Revision status
- Current roadmap
- Daily goals

Outputs:

- Recommended topic
- Recommended problems
- Estimated study duration
- Explanation

---

## 4.2 Performance Analyzer

Purpose:

Evaluate learning progress.

Metrics:

- Accuracy
- Success rate
- Time complexity usage
- Space complexity usage
- Average solving time
- Topic mastery

Outputs:

- Performance report
- Weakness score
- Strength score

---

## 4.3 Mistake Analyzer

Purpose:

Identify repeated mistakes.

Categories:

- Logic
- Syntax
- Edge cases
- Optimization
- Wrong algorithm
- Time complexity
- Space complexity

The AI should recognize patterns rather than isolated mistakes.

---

## 4.4 Revision Engine

Purpose:

Generate intelligent revision schedules.

Inputs:

- Last revision date
- Difficulty
- Confidence score
- Forgetting probability

Outputs:

- Today's revision queue
- Priority order
- Estimated revision duration

---

## 4.5 Learning Path Generator

Purpose:

Generate personalized roadmaps.

Factors:

- Experience level
- Goals
- Available study time
- Completed topics
- Weak topics

Outputs:

- Ordered learning sequence
- Milestones
- Estimated completion timeline

---

## 4.6 Interview Readiness Analyzer

Purpose:

Estimate interview preparedness.

Factors:

- Problem count
- Topic coverage
- Difficulty distribution
- Mock interview performance
- Revision consistency

Output:

Interview Readiness Score (0–100)

---

# 5. Data Used by AI

The AI Engine analyzes:

- Solved problems
- Failed attempts
- Time spent
- Topic progress
- Revision history
- Mistake journal
- Learning notes
- Daily activity
- Streak history
- User goals

---

# 6. Recommendation Logic

The recommendation score is calculated using weighted factors.

Example:

Recommendation Score =
40% Weakness Score +
25% Revision Priority +
15% Roadmap Position +
10% User Goal +
10% Learning Consistency

The highest-scoring topic becomes today's recommendation.

---

# 7. Weakness Detection

Each topic receives a mastery score.

Example:

Arrays

Mastery: 90%

Graphs

Mastery: 42%

Dynamic Programming

Mastery: 27%

Binary Search

Mastery: 85%

Topics below a configurable threshold are marked as weak.

---

# 8. Confidence Score

Every solved problem contributes to a confidence score.

Factors:

- Solved without hints
- Number of attempts
- Time taken
- Recent revisions
- Similar problem performance

Range:

0–100

---

# 9. Daily Study Planner

Every day the AI generates:

- Main topic
- Revision tasks
- Recommended problems
- Estimated study duration
- Motivation message

Example:

Today's Plan

Topic:
Sliding Window

Revision:
Binary Search

Problems:
3 Easy
2 Medium

Estimated Time:
2 Hours

---

# 10. Personalized Explanations

The AI never gives recommendations without reasoning.

Example:

"You struggled with Sliding Window problems during the past week and have not revised the topic for 12 days. Reviewing it now is likely to improve long-term retention."

---

# 11. AI Memory

The AI maintains long-term learning context.

Stored information includes:

- Previous conversations
- Weak topics
- Study preferences
- Frequently asked questions
- Learning goals
- Common mistakes

This enables continuity between sessions.

---

# 12. Large Language Model Integration

The LLM is responsible for:

- Explaining concepts
- Answering questions
- Reviewing code
- Giving hints
- Summarizing notes
- Creating study plans

The application should provide the model with relevant user context to produce personalized responses.

---

# 13. Prompt Pipeline

Every AI request includes:

System Prompt

↓

User Context

↓

Learning History

↓

Current Progress

↓

User Question

↓

Generated Response

---

# 14. AI Safety Rules

The AI must:

- Avoid hallucinating technical facts.
- Clearly distinguish certainty from assumptions.
- Encourage understanding over giving direct answers.
- Avoid revealing full solutions unless requested.
- Respect user privacy.
- Never expose another user's data.

---

# 15. Performance Goals

Average recommendation generation:

< 2 seconds

Average AI response:

< 5 seconds

Dashboard analysis:

< 3 seconds

Roadmap generation:

< 5 seconds

---

# 16. Future AI Capabilities

Future versions may include:

- Automatic code complexity analysis
- Interview simulation
- Voice conversations
- Personalized quizzes
- Contest performance prediction
- Company-specific preparation
- Resume analysis
- Pair programming assistant

---

# 17. Success Metrics

The AI Engine is considered successful if it:

- Increases learning consistency.
- Improves interview readiness.
- Reduces repeated mistakes.
- Improves revision completion.
- Increases roadmap completion rate.
- Helps users solve harder problems over time.

---

# 18. Conclusion

The AI Engine transforms AI DSA Mentor from a simple progress tracker into an intelligent learning companion. By continuously analyzing user behavior and adapting recommendations, it provides personalized mentorship that evolves alongside the learner, making every study session more focused, efficient, and effective.

---

**End of AI Engine Design Document**
