# 🗂 To-Do List Application — Project Overview

**Project:** Internal Productivity Tool (MVP)  
**Author:** Anastasiia Desiateryk  
**Date:** 2025-10-09  
**Version:** 1.0  
**Reviewed by:** M. Maier  
**System:** To-Do Application (MVP)  

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

The application follows a **client–server architecture** with a secure authentication layer and a modular backend API.

- **Frontend:** React SPA (Single Page Application) with responsive design (desktop & mobile).  
- **Authentication:** Azure AD (OIDC) integrated via API Gateway, validating JWT tokens.  
- **Backend:** Node.js / Express API for CRUD operations on tasks.  
- **Database:** MongoDB Atlas with documents indexed by `owner_id`.  
- **Deployment:** Hosted on cloud platform (render.com / Azure App Service).  

All communication between frontend and backend uses HTTPS with Bearer tokens.

---
