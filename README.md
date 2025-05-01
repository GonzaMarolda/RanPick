# RanPick
 
[![Deploy Status](https://img.shields.io/badge/deployed%20on-Render-black?style=flat&logo=render)](https://ranpick.onrender.com/)

Web app to create wheels that pick a value randomly. You can add entries, spin the wheel, and see which one is the winner.
The most relevant feature is the possibility of creating nested wheels, you can create a "Dinner" wheel and another wheel for "Pasta" if gets selected.

<img src="https://github.com/user-attachments/assets/feaa8a96-ee2a-43bc-8d68-f83ad1ec1eb1" alt="Captura de la app" width="500" height="233" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>

👉 **Try it here:** [ranpick.onrender.com](https://ranpick.onrender.com)

## Main features
- ⭕ Wheel creation and editing
- 🏷️ Entry editing: Probability and color
- 👤 Sign up and Log in manually or with SSO
- 📁 Wheel save, loading and delete functionality
- ↪️ Nested wheels
- 📝 Selected entries history

## Technologies

**Frontend:**
- Angular 19
- SCSS

**Backend**
- Prisma + PostgreSQL
- Node.js + Express
- JWT Authentication
- Bcrypt password hashing

**Testing**
- Playwright (E2E)

## Local development with Docker
You can run the app locally using Docker and Docker Compose
### Requirements
- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
### Running locally
```
docker-compose up --build
```
The app will be accessible at [http://localhost:4200/](http://localhost:4200/)
