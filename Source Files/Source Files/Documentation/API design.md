
# API Design Document (API Specification)

## Project: AI DSA Mentor

**Version:** 1.0  
**Status:** Draft  
**Product Owner:** Chetan  
**Technical Lead:** ChatGPT  
**Date:** 30 June 2026  

---

# 1. Introduction

## 1.1 Purpose

This document defines the API architecture and communication structure of AI DSA Mentor.

The API layer acts as the bridge between:

- Frontend application
- Backend services
- Database
- AI recommendation engine
- External coding platforms

The purpose of this API design is to create a scalable, secure, and maintainable communication system that supports personalized DSA learning experiences.

---

# 2. API Architecture Overview

AI DSA Mentor follows a REST-based API architecture.

## High-Level Flow


Frontend Application
|
|
v
Backend API Layer
|
-

|           |            |
User     Learning     AI Engine
Service  Service      Service
|
|
Database




# 3. API Design Principles

## 3.1 RESTful Architecture

Resources are represented using standard HTTP methods:

- GET
- POST
- PUT
- DELETE

---

## 3.2 Stateless Communication

Each request contains all required information.

The server does not depend on previous requests.

---

## 3.3 Secure Data Handling

Sensitive information such as:

- Passwords
- Authentication tokens
- User data

must be protected.

---

## 3.4 Scalable Structure

The API should support:

- Increasing users
- More AI features
- More integrations
- Larger datasets

---

# 4. Base API Structure

Base URL:

```

[https://api.ai-dsa-mentor.com/v1](https://api.ai-dsa-mentor.com/v1)

```

All APIs follow:

```

/api/v1/{resource}

```

Example:

```

GET /api/v1/users/profile

```

---

# 5. Authentication API

Authentication uses JWT-based authentication.

---

# 5.1 Register User

## Endpoint

```

POST /auth/register

````

## Request

```json
{
 "name": "John",
 "email": "john@email.com",
 "password": "password123"
}
````

## Response

```json
{
 "success": true,
 "message": "User registered successfully",
 "userId": "12345"
}
```

---

# 5.2 Login User

## Endpoint

```
POST /auth/login
```

## Request

```json
{
 "email": "john@email.com",
 "password": "password123"
}
```

## Response

```json
{
 "token": "jwt_token",
 "userId": "12345"
}
```

---

# 5.3 Logout

## Endpoint

```
POST /auth/logout
```

Response:

```json
{
 "message":"Logged out successfully"
}
```

---

# 6. User Management APIs

## 6.1 Get User Profile

Endpoint:

```
GET /users/profile
```

Response:

```json
{
"name":"John",
"level":"Intermediate",
"problemsSolved":150,
"currentStreak":20
}
```

---

## 6.2 Update User Profile

Endpoint:

```
PUT /users/profile
```

Request:

```json
{
"goal":"Interview Preparation",
"dailyTarget":3
}
```

---

# 7. Problem Tracking APIs

## 7.1 Add Solved Problem

Endpoint:

```
POST /problems/solve
```

Request:

```json
{
"problemId":"LC123",
"topic":"Arrays",
"difficulty":"Medium",
"timeTaken":45
}
```

Response:

```json
{
"message":"Problem added successfully"
}
```

---

## 7.2 Get Solved Problems

Endpoint:

```
GET /problems/history
```

Response:

```json
[
 {
  "problem":"Two Sum",
  "topic":"Arrays",
  "status":"Solved"
 }
]
```

---

# 8. Learning Roadmap APIs

## 8.1 Generate Learning Roadmap

Endpoint:

```
POST /roadmap/generate
```

Request:

```json
{
"goal":"Placement Preparation",
"level":"Beginner"
}
```

Response:

```json
{
"roadmap":[
"Arrays",
"Strings",
"Linked List",
"Trees"
]
}
```

---

## 8.2 Get Current Roadmap

Endpoint:

```
GET /roadmap/current
```

Response:

```json
{
"currentTopic":"Binary Search",
"progress":65
}
```

---

# 9. AI Recommendation APIs

The AI engine provides personalized learning suggestions.

---

## 9.1 Get Daily Recommendation

Endpoint:

```
GET /ai/recommendation/daily
```

Response:

```json
{
"recommendation":
"Solve sliding window problems today",

"reason":
"Your recent mistakes show weakness in window optimization"
}
```

---

## 9.2 Analyze Performance

Endpoint:

```
POST /ai/analyze
```

Request:

```json
{
"userId":"12345"
}
```

Response:

```json
{
"weakTopics":[
"Graphs",
"Dynamic Programming"
],

"strengths":[
"Arrays"
]
}
```

---

# 10. Revision System APIs

## 10.1 Get Revision Tasks

Endpoint:

```
GET /revision/today
```

Response:

```json
{
"tasks":[
"Review Binary Search",
"Redo Problem LC101"
]
}
```

---

## 10.2 Mark Revision Complete

Endpoint:

```
POST /revision/complete
```

Request:

```json
{
"topic":"Arrays"
}
```

---

# 11. Notes and Mistake Tracking APIs

## 11.1 Add Learning Note

Endpoint:

```
POST /notes
```

Request:

```json
{
"problemId":"LC200",
"note":"DFS recursion mistake"
}
```

---

## 11.2 Get Notes

Endpoint:

```
GET /notes
```

Response:

```json
[
{
"topic":"Graphs",
"note":"Remember visited array"
}
]
```

---

# 12. Analytics APIs

## 12.1 Progress Dashboard

Endpoint:

```
GET /analytics/dashboard
```

Response:

```json
{
"totalSolved":250,
"accuracy":82,
"streak":15,
"weakAreas":[
"DP"
]
}
```

---

# 13. Error Handling

All APIs follow a standard error format.

Example:

```json
{
"success":false,
"error":{
"code":"INVALID_REQUEST",
"message":"Missing required field"
}
}
```

---

# 14. HTTP Status Codes

| Code | Meaning              |
| ---- | -------------------- |
| 200  | Successful Request   |
| 201  | Created Successfully |
| 400  | Bad Request          |
| 401  | Unauthorized         |
| 403  | Forbidden            |
| 404  | Resource Not Found   |
| 500  | Server Error         |

---

# 15. Security Design

## Authentication

JWT tokens are used.

---

## Authorization

Users can only access their own:

* Progress
* Notes
* History
* Recommendations

---

## Data Protection

Passwords are stored using secure hashing algorithms.

Sensitive information is never returned through APIs.

---

# 16. AI Service Communication

Backend communicates with AI service through internal APIs.

Flow:

```
Backend
   |
   |
AI Recommendation Engine
   |
   |
User Learning Data
```

AI receives:

* Solved problems
* Mistakes
* Learning history
* Performance metrics

AI returns:

* Recommendations
* Analysis
* Personalized roadmap updates

---

# 17. Future API Expansion

Future versions may include:

* Code submission analysis API
* Competitive programming integration
* AI interview simulator API
* Peer discussion API
* Voice learning assistant API

---

# 18. Conclusion

The API layer of AI DSA Mentor provides a structured communication system between all application components.

The design focuses on:

* Scalability
* Security
* Maintainability
* AI-driven personalization

This API architecture allows AI DSA Mentor to evolve from a learning tracker into a complete intelligent DSA mentorship platform.

---

# End of Document

```
```
