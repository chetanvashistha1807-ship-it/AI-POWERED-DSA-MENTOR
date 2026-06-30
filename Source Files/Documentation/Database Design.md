# Database Design Document (DBD)

# Project: AI DSA Mentor

**Version:** 1.0  
**Status:** Draft  
**Date:** 30 June 2026

---

# 1. Introduction

## Purpose

This document defines the database architecture for AI DSA Mentor.

The database is responsible for storing user information, learning progress, solved problems, mistakes, recommendations, AI-generated insights, study history, and all data required to provide personalized DSA mentorship.

The database should support:

- User progress tracking
- Personalized recommendations
- Learning analytics
- Revision scheduling
- AI context generation
- Problem-solving history
- Knowledge retention

---

# 2. Database Design Goals

The database should:

- Maintain a complete learning history of each user
- Store structured DSA knowledge
- Allow AI models to understand user behavior
- Support personalized learning paths
- Enable future analytics features
- Scale as user activity increases

---

# 3. Database Type

## Primary Database

Relational Database Management System (RDBMS)

Recommended:

- PostgreSQL

Reason:

- Strong relational structure
- Complex querying support
- Data consistency
- Good support for analytics
- JSON support for AI-generated data


## Supporting Storage

Future additions:

- Vector Database for AI embeddings
- Object storage for documents/files

Examples:

- Pinecone
- Weaviate
- pgvector

---

# 4. Database Entities Overview

Main entities:

1. Users
2. User Profiles
3. DSA Topics
4. Problems
5. Problem Attempts
6. User Progress
7. Mistake Records
8. Notes
9. Learning Roadmaps
10. Study Sessions
11. AI Recommendations
12. Revision Schedule
13. Achievements


---

# 5. Entity Relationship Overview


Users

↓

User Profile

↓

Learning Progress

↓

Topics

↓

Problems

↓

Problem Attempts


Users

↓

AI Recommendations

↓

Study Sessions

↓

Revision System


---

# 6. Table Design


# 6.1 Users Table

Stores authentication and basic account information.


| Column | Type | Description |
|-|-|-|
| user_id | UUID | Primary key |
| name | VARCHAR | User name |
| email | VARCHAR | User email |
| password_hash | VARCHAR | Encrypted password |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last update |


Primary Key:

user_id


---

# 6.2 User_Profile Table

Stores learning preferences and goals.


| Column | Type | Description |
|-|-|-|
| profile_id | UUID | Primary key |
| user_id | UUID | Foreign key |
| experience_level | VARCHAR | Beginner/Intermediate/Advanced |
| target_goal | VARCHAR | Interview, Competitive programming etc |
| daily_time_goal | INT | Minutes per day |
| preferred_language | VARCHAR | C++, Java, Python etc |
| created_at | TIMESTAMP | Creation time |


Relationship:

Users 1 ---- 1 User_Profile


---

# 6.3 DSA_Topics Table

Stores structured DSA topics.


Examples:

Arrays

Linked Lists

Trees

Graphs

Dynamic Programming


| Column | Type | Description |
|-|-|-|
| topic_id | UUID | Primary key |
| topic_name | VARCHAR | Topic name |
| description | TEXT | Explanation |
| difficulty_level | VARCHAR | Difficulty |
| parent_topic_id | UUID | Parent topic |


Supports hierarchical topics.


Example:

Data Structures

→ Trees

→ Binary Trees

→ BST


---

# 6.4 Problems Table

Stores DSA problems.


| Column | Type | Description |
|-|-|-|
| problem_id | UUID | Primary key |
| topic_id | UUID | Related topic |
| title | VARCHAR | Problem title |
| platform | VARCHAR | Leetcode etc |
| external_link | TEXT | Problem URL |
| difficulty | VARCHAR | Easy Medium Hard |
| pattern | VARCHAR | Sliding window, DP etc |
| description | TEXT | Problem description |


Relationship:

Topic 1 ---- Many Problems


---

# 6.5 Problem_Attempts Table

Stores every attempt made by users.


| Column | Type | Description |
|-|-|-|
| attempt_id | UUID | Primary key |
| user_id | UUID | User |
| problem_id | UUID | Problem |
| status | VARCHAR | Solved/Attempted/Failed |
| time_taken | INT | Minutes |
| attempts_count | INT | Number of tries |
| solution_link | TEXT | User solution |
| created_at | TIMESTAMP | Attempt date |


Purpose:

Allows AI to understand:

- Success rate
- Weak patterns
- Learning speed


---

# 6.6 Mistake_Records Table

Stores repeated mistakes.


| Column | Type | Description |
|-|-|-|
| mistake_id | UUID | Primary key |
| user_id | UUID | User |
| problem_id | UUID | Problem |
| mistake_type | VARCHAR | Logic, syntax, concept |
| explanation | TEXT | Mistake details |
| resolved | BOOLEAN | Fixed or not |
| created_at | TIMESTAMP | Date |


AI uses this to identify weaknesses.


---

# 6.7 User_Progress Table

Stores topic mastery.


| Column | Type | Description |
|-|-|-|
| progress_id | UUID | Primary key |
| user_id | UUID | User |
| topic_id | UUID | Topic |
| mastery_score | FLOAT | 0-100 |
| problems_solved | INT | Count |
| last_revision | TIMESTAMP | Last revision |
| updated_at | TIMESTAMP | Update time |


Example:

Arrays → 85%

Graphs → 40%


---

# 6.8 Notes Table

Stores user learning notes.


| Column | Type | Description |
|-|-|-|
| note_id | UUID | Primary key |
| user_id | UUID | User |
| topic_id | UUID | Topic |
| content | TEXT | Note content |
| created_at | TIMESTAMP | Creation date |


---

# 6.9 Learning_Roadmaps Table

Stores personalized learning plans.


| Column | Type | Description |
|-|-|-|
| roadmap_id | UUID | Primary key |
| user_id | UUID | User |
| title | VARCHAR | Roadmap name |
| generated_by | VARCHAR | AI/System |
| status | VARCHAR | Active/Completed |
| created_at | TIMESTAMP | Date |


---

# 6.10 Roadmap_Items Table

Individual steps inside roadmap.


| Column | Type | Description |
|-|-|-|
| item_id | UUID | Primary key |
| roadmap_id | UUID | Roadmap |
| topic_id | UUID | Topic |
| order_number | INT | Sequence |
| completed | BOOLEAN | Status |


---

# 6.11 Study_Sessions Table

Tracks learning sessions.


| Column | Type | Description |
|-|-|-|
| session_id | UUID | Primary key |
| user_id | UUID | User |
| duration | INT | Minutes |
| problems_completed | INT | Count |
| topics_studied | JSON | Topics |
| session_date | TIMESTAMP | Date |


---

# 6.12 AI_Recommendations Table

Stores AI generated suggestions.


| Column | Type | Description |
|-|-|-|
| recommendation_id | UUID | Primary key |
| user_id | UUID | User |
| recommendation_type | VARCHAR | Problem/Topic/Revision |
| content | TEXT | Recommendation |
| reasoning | TEXT | AI explanation |
| created_at | TIMESTAMP | Date |


Example:

"Revise Binary Search because accuracy dropped in recent attempts."


---

# 6.13 Revision_Schedule Table

Stores spaced repetition data.


| Column | Type | Description |
|-|-|-|
| revision_id | UUID | Primary key |
| user_id | UUID | User |
| topic_id | UUID | Topic |
| next_revision | DATE | Next review |
| priority | INT | Importance |


---

# 6.14 Achievements Table

Stores milestones.


| Column | Type | Description |
|-|-|-|
| achievement_id | UUID | Primary key |
| user_id | UUID | User |
| title | VARCHAR | Achievement |
| description | TEXT | Details |
| achieved_at | TIMESTAMP | Date |


Examples:

- 100 problems solved
- 30 day streak
- DP mastered


---

# 7. Relationships


## User Relationships

User

has one:

- User Profile


User

has many:

- Problem Attempts
- Notes
- Study Sessions
- Recommendations
- Achievements


---

## Topic Relationships

Topic

has many:

- Problems
- User Progress
- Revision Records


---

## Problem Relationships

Problem

has many:

- Attempts
- Mistake Records


---

# 8. Indexing Strategy


Important indexes:


Users:

- email


Problems:

- topic_id
- difficulty
- pattern


Attempts:

- user_id
- problem_id


Progress:

- user_id
- topic_id


Recommendations:

- user_id
- created_at


---

# 9. Data Flow


User solves problem

↓

Problem Attempt created

↓

Progress updated

↓

Mistakes analyzed

↓

AI Recommendation generated

↓

Revision schedule updated


---

# 10. Future Database Improvements


Possible additions:

- AI conversation history
- Code execution results
- Community discussions
- Peer comparisons
- Interview simulation data
- Learning embeddings


---

# End of Database Design Document
