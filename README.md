# Training Tracker System

Fullstack platform for athlete performance tracking, scheduling, and training analytics.
Built to support coaches and teams in monitoring workload, planning sessions, and optimizing performance.

![Design sem nome (6)](https://github.com/user-attachments/assets/b5dbfbac-44fc-4a0c-999e-ad726d32af0b)

---

## Overview

The **Training Tracker System** is a complete solution for managing athletes and training routines, combining:

* Training scheduling
* Load monitoring (planned vs performed)
* Wellness and injury tracking
* Athlete & coach management
* Performance analytics dashboards

This project was designed with a **scalable fullstack architecture**, following modern best practices.

---

## Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS / MUI**
* **SWR**

### Mobile

* **React Native (Expo)**
* **NativeWind**

### Backend

* **NestJS**
* **TypeScript**
* **Prisma ORM**

### Database

* **PostgreSQL**

### Others

* JWT Authentication
* REST APIs
* Zod validation
* React Hook Form

---

## Features

### User & Access

* Authentication with JWT
* Role-based access (Admin / Collaborator)
* First access & password recovery flow

### Athletes Management

* Athlete registration with full profile
* Injury and pain tracking
* Club and address management

### Training Scheduling

* Weekly and daily training calendar
* Drag & drop scheduling
* Coach assignment
* Time-based visualization

### Monitoring & Analytics

* Training load tracking (planned vs performed)
* Wellness monitoring
* Weekly charts and reports
* Acute:Chronic workload ratio

### Reports

* Reports by athlete
* Reports by collaborator
* Filtering by date range

---

## Architecture

The project follows a **modular and scalable architecture**:

* Backend structured with:

  * UseCases
  * Repositories
  * Entities
  * DTOs

* Frontend structured with:

  * Reusable components
  * Hooks (SWR)
  * Context API (state management)

* Separation of concerns:

  * API (NestJS)
  * Web (Next.js)
  * Mobile (React Native)

---

## Project Structure

```
training-tracker-system/
│
├── backend/        # NestJS API
├── web/            # Next.js frontend
└── docs/           # Documentation (optional)
```


---

## Notes for Local Development

* Email queue is **disabled locally**
* Some features (email notifications) may be mocked or skipped
* Tokens for password creation can be retrieved directly from database when testing

---

## Future Improvements

* [ ] Real-time updates (WebSockets)
* [ ] AI-based performance insights
* [ ] Advanced dashboards (BI level)
* [ ] Multi-tenant support (clubs/teams)
* [ ] Notification system (push/email)

---

## Purpose

This project was built as a **portfolio-grade fullstack system**, demonstrating:

* Clean architecture with NestJS
* Advanced frontend patterns with Next.js
* Mobile-first approach with React Native
* Real-world domain modeling (sports performance)

---

## Author

**Rômulo Zirbes**
Fullstack Developer

* GitHub: https://github.com/Rzirbes
* LinkedIn: (add aqui depois)

---

---

## Screenshots

### Dashboard & Analytics
<img width="1918" height="1079" alt="Captura de tela de 2026-03-17 10-37-55" src="https://github.com/user-attachments/assets/4a326980-888e-46c9-a523-204c4624eb9c" />


### Training Calendar
<img width="1920" height="993" alt="Captura de tela de 2026-03-17 10-39-37" src="https://github.com/user-attachments/assets/07711247-74d6-495f-9b6f-b424fb99241b" />


## ⭐ If you like this project

Give it a star ⭐ and feel free to explore the code!
