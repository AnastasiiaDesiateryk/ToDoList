# 🗂 To-Do List Application — Project Overview

**Project:** Internal Productivity Tool (MVP)  
**Author:** Anastasiia Desiateryk  
**Date:** 2025-10-09  
**Version:** 1.0  
**Reviewed by:** M. Maier  
**System:** To-Do Application (MVP)  

---

| Document | Description |
|-----------|--------------|
| [2_Requirements_ToDoApp.md](./docs/2_Requirements_ToDoApp.md) | Detailed functional & non-functional requirements for the To-Do Application. |
| [3_UserStories.md](./docs/3_UserStories.md) | User stories with acceptance criteria. |
| [4_UseCaseDiagram.md](./docs/4_UseCaseDiagram.md) | Use case diagram and system interaction overview. |

---

### Traceability
This document acts as the **root of the project documentation tree**.  
Each linked file elaborates a different layer of the MVP:
- Requirements → define the “what”  
- User stories → describe the “how” from the user’s view  
- Use case diagram → visualizes the “who interacts with what”  

---

## 1. Purpose and Scope

The **To-Do List Application** is an internal productivity tool (MVP) that allows authenticated users to create, organize, and manage personal tasks.  
Its main goal is to demonstrate end-to-end functional design: from user interaction (UI/UX) through data persistence, authentication, and secure task management.  
The system is intentionally lightweight, yet scalable, designed to support future integration into a larger productivity suite.

---

## 2. Users and Use Context

The primary users are individual employees who need a simple, structured way to plan daily work.  
Each user has a personal workspace — after signing in via **Azure Active Directory (Entra ID)**, they can create, edit, categorize, prioritize, and complete tasks.  
All data is user-scoped: every record in the database is linked to an `owner_id`, ensuring isolation and privacy.  

---

## 3. System Architecture Overview

The application follows a **modern client–server architecture** with a **stateless authentication layer**, modular **Spring Boot backend**, and **React SPA frontend**.

- **Frontend:** React Single-Page Application (SPA) with responsive layout for desktop & mobile.  
- **Authentication:** Google Sign-In (Firebase) → JWT verification via **Nimbus JOSE + JWT**; internal token issued as **HttpOnly cookie (`APP_AUTH`)**.  
- **Backend:** Java 21 / Spring Boot 3.3 REST API with layered architecture (`web`, `security`, `service`, `repository`, `entity`, `dto`).  
- **Database:** PostgreSQL 16 with Flyway migrations, JPA/Hibernate 6, and JSON-based metadata fields.  
- **Deployment:** Cloud-hosted on Render / Kubernetes (Azure App Service compatible).  
- **Communication:** All traffic secured via HTTPS; frontend ↔ backend interaction over JSON/REST.  
- **Observability:** Spring Boot Actuator endpoints for health, metrics, and readiness probes.  

---

## 4. Technology Stack

### Platform
- **Java 21 (LTS)** — modern language features (records, switch patterns, virtual threads-ready).  
- **Maven 3.x** — reproducible builds, dependency management.  
  - `spring-boot-maven-plugin` — fat JAR packaging.  
  - `maven-compiler-plugin` — `release=21`.  
  - Annotation processors — MapStruct.  

---

###  Core Framework
- **Spring Boot 3.3.x** — auto-configuration, dependency management, environment profiles (`local`, `prod`).  
- **Spring Validation (Jakarta)** — `@Valid`, `@NotBlank`, `@Email`.  
- **Spring Actuator** — `/actuator/{health,info,metrics}` endpoints for observability.  

---

###  Web & Security
- **Spring Web (MVC)** — REST controllers with Jackson (datatype JSR-310 for `OffsetDateTime`).  
- **Spring Security** — filter chain with stateless JWT authentication.  

####  Authentication Flow:
1. Frontend obtains Google ID token from Firebase.  
2. Backend verifies via **Nimbus JOSE + JWT** (`SignedJWT`, `JWKSet` cache 1 h).  
3. Internal JWT issued → **HttpOnly cookie (`APP_AUTH`)** with `SameSite=None; Secure`.  
4. Subsequent API calls authorized via `JwtAuthenticationFilter`.  

- **CORS:** exact origins, `allowCredentials=true`, no wildcards.  
- **Algorithms:** HMAC256 / RS256 (selectable).  

---

###  Data Storage
- **PostgreSQL 16** — main database.  
- **Spring Data JPA / Hibernate 6** — ORM layer.  
  - `@Entity`, `@Version` (optimistic locking).  
  - Lazy loading and transactional service methods.  
  - `@ElementCollection` (for tags).  
  - `@Lob TEXT` + Jackson for `metadata`.  
- **Flyway** — versioned migrations (`V1__*.sql`, `V2__*.sql`, …).  
- **Enum sync** — DB values match `@Enumerated(EnumType.STRING)`.  

---

###  Mapping & DTOs
- **MapStruct** — compile-time mapping (Entity ↔ DTO).  
  - Separate `@BeanMapping` for create / patch operations.  
  - Manual `ObjectMapper` for complex metadata cases.  

---

###  API Documentation
- **springdoc-openapi-starter-webmvc-ui** — interactive Swagger UI (`/swagger-ui/index.html`).  
- **OpenAPI** spec auto-generated from controller and DTO annotations.  

---

###  Testing & Isolation
- **spring-boot-starter-test** + **spring-security-test** — unit and slice tests.  
- **Testcontainers (PostgreSQL)** — deterministic integration tests in Docker.  

---

###  Configuration & Environments
- **Profiles:** `local`, `prod`.  
- **spring-dotenv** — `.env` for secrets (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`).  
- **Forwarded headers:** `server.forward-headers-strategy=framework` for proxy compatibility.  

---

### 📊 Observability & Operations
- **Actuator** — health / readiness / liveness probes.  
- **Logging:** standard pattern (Logback encoder → JSON optional).  
- **Cookies:** Secure + HttpOnly in production; Bearer mode allowed for dev CLI.  

---



### 💡 Why This Stack
- **Spring Boot + JPA** — fast path to consistent transactional CRUD.  
- **Nimbus JOSE + JWT** — lightweight, battle-tested JWT stack.  
- **Flyway** — reliable schema control for team and CI/CD.  
- **MapStruct** — type-safe compile-time mapping (no reflection).  
- **Testcontainers** — isolated tests on real Postgres.  
- **No Lombok** — explicit getters/setters for clarity and tool compatibility.  


---
