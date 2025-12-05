# Thinkboard - Task Management Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing tasks and notes with Google OAuth authentication, priority-based task organization, and real-time status updates.

> Frontend code lives in a separate repository: https://github.com/lovishjindal87/thinkboard-frontend

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Tech Stack Rationale](#tech-stack-rationale)
- [Setup Instructions](#setup-instructions)
- [Assumptions](#assumptions)
- [Usage of AI Tools](#usage-of-ai-tools)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

## Features

-  **Google OAuth Authentication** - Secure login with Google accounts
-  **Task Management** - Create, read, update, and delete tasks/notes
-  **Priority System** - Organize tasks by priority (Low, Medium, High)
-  **Status Tracking** - Track task status (To Do, In Progress, Done)
-  **Due Dates** - Set optional due dates for tasks
-  **Search & Filter** - Search tasks by title/description and filter by status
-  **Rate Limiting** - API rate limiting using Upstash Redis
-  **Modern UI** - Responsive design with Tailwind CSS and DaisyUI

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing
- **Upstash Redis** - Rate limiting service

### Deployment
- **Vercel** - Hosting platform (both frontend and backend)

## Tech Stack Rationale

### Frontend Choices

**React 19**: Chosen for its component-based architecture, large ecosystem, and excellent developer experience. React's virtual DOM provides efficient rendering for dynamic task lists.

**Vite**: Selected over Create React App for significantly faster development builds and hot module replacement. Vite's native ES modules support improves development experience.

**React Router 7**: Enables client-side routing without page refreshes, providing a smooth single-page application experience for navigating between task views.

**Tailwind CSS + DaisyUI**: Tailwind's utility classes allow rapid UI development, while DaisyUI provides pre-built components that maintain design consistency. This combination reduces CSS boilerplate and speeds up development.

**Axios**: Preferred over fetch API for better error handling, request/response interceptors, and automatic JSON parsing. Essential for handling authentication cookies.

**React Hot Toast**: Lightweight toast notification library that provides user feedback for actions like creating, updating, or deleting tasks.

### Backend Choices

**Express.js**: Industry-standard Node.js framework with extensive middleware ecosystem. Provides routing, middleware support, and easy integration with authentication libraries.

**MongoDB + Mongoose**: MongoDB's flexible schema suits task management where tasks may have optional fields (description, due dates). Mongoose provides schema validation, middleware, and type casting.

**JWT with HTTP-only Cookies**: JWT tokens stored in HTTP-only cookies provide secure authentication. Cookies are automatically sent with requests, preventing XSS attacks while maintaining stateless authentication.

**Upstash Redis**: Serverless Redis solution for rate limiting. Prevents API abuse without managing Redis infrastructure. Essential for production deployments.

**Cookie Parser**: Required for parsing authentication cookies sent from the frontend. Express middleware that extracts cookies from request headers.

### Architecture Decisions

**Separate Frontend/Backend**: Enables independent deployment, scaling, and technology choices. Frontend can be served via CDN while backend scales separately.

**Serverless-Ready**: Database connection caching and middleware design support Vercel's serverless functions, ensuring efficient cold starts.

**CORS Configuration**: Properly configured CORS with credentials support enables cross-origin requests while maintaining security in production.

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Google Cloud Console account (for OAuth)
- Upstash account (for rate limiting)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in the backend directory:**
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5001/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   PORT=5001
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The backend will start on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in the frontend directory (optional for local development):**
   ```env
   VITE_BACKEND_URL=http://localhost:5001
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5001/api/auth/google/callback` (for development)
6. Copy Client ID and Client Secret to your backend `.env` file

### MongoDB Setup

1. Create a MongoDB Atlas account or use a local MongoDB instance
2. Create a new cluster (if using Atlas)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `MONGO_URI` in backend `.env`

### Upstash Redis Setup

1. Create an account at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and Token
4. Add them to your backend `.env` file

## Assumptions

1. **User Authentication**: All users authenticate via Google OAuth. No email/password authentication is implemented.

2. **Task Ownership**: Each task/note is associated with a single user. Users can only view and modify their own tasks.

3. **Priority Levels**: Tasks have three priority levels (Low, Medium, High) with Medium as the default.

4. **Status Values**: Tasks have three status values (To Do, In Progress, Done) with To Do as the default.

5. **Optional Fields**: Task description and due date are optional fields. Only the title is required.

6. **Rate Limiting**: API requests are rate-limited to prevent abuse. The rate limit is configured via Upstash Redis.

7. **Development Environment**: Local development assumes frontend on port 5173 and backend on port 5001.

8. **Production Deployment**: Both frontend and backend are deployed on Vercel. Environment variables must be configured in Vercel dashboard.

9. **HTTPS in Production**: Production deployments use HTTPS. Cookies require `secure: true` and `sameSite: "none"` for cross-origin support.

10. **Browser Support**: Modern browsers with ES6+ support and cookie handling capabilities are assumed.

11. **Database**: MongoDB Atlas is used for production. Local MongoDB can be used for development.

12. **CORS**: Frontend and backend may be on different domains in production. CORS is configured to allow credentials.

## Usage of AI Tools

### How AI Tools Were Used

AI tools were used **minimally** and only for the following purposes:

1. **Debugging Specific Issues**: 
   - Used to troubleshoot cross-origin cookie authentication issues in production
   - Helped identify CORS configuration problems
   - Assisted in understanding JWT cookie handling across different domains

2. **Code Suggestions for Edge Cases**:
   - Received suggestions for handling authentication redirect timing issues
   - Got recommendations for retry logic in API calls

3. **Learning Concepts**:
   - Clarified understanding of `sameSite` cookie attributes
   - Explained CORS credentials handling
   - Understood serverless function connection pooling patterns

### What Was NOT Done by AI

The vast majority of this project was developed independently:

-  **Complete project architecture and design** - All decisions made independently
-  **Database schema design** - User and Note models designed from scratch
-  **Authentication flow implementation** - Google OAuth integration implemented manually
-  **Frontend components** - All React components (Navbar, NoteCard, HomePage, etc.) built independently
-  **API endpoints and controllers** - All CRUD operations implemented manually
-  **UI/UX design** - Layout, styling, and user experience designed independently
-  **State management** - AuthContext and component state management implemented manually
-  **Routing configuration** - React Router setup done independently
-  **Rate limiting implementation** - Upstash integration implemented manually
-  **Deployment configuration** - Vercel configuration files created manually

### AI Tool Disclosure

**Tools Used**: Cursor (AI-powered code editor)

**Specific Usage**:
- Used AI assistance to debug production authentication cookie issues (approximately 2-3 hours of troubleshooting)
- Received code suggestions for retry logic in authentication context (minor implementation)
- Asked clarifying questions about cookie attributes and CORS behavior

**Percentage of Work**: Approximately 95% of the codebase was written independently. AI tools were used for less than 5% of the project, primarily for debugging specific production deployment issues.

**Understanding Demonstrated**: All code has been thoroughly reviewed, understood, and customized. The authentication flow, database models, API endpoints, and frontend components were all designed and implemented with full understanding of the underlying concepts.

### Original Work Statement

This project represents original work with minimal AI assistance. All explanations, documentation, and the majority of code implementation were completed independently. AI tools were used only as a debugging aid for specific technical challenges encountered during deployment.

## Project Structure

```
thinkboard-mern-main/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── upstash.js         # Upstash Redis configuration
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   └── notesControllers.js # CRUD operations for notes
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authentication middleware
│   │   │   └── rateLimiter.js     # Rate limiting middleware
│   │   ├── models/
│   │   │   ├── Note.js            # Note/Task schema
│   │   │   └── User.js            # User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Authentication routes
│   │   │   └── notesRoutes.js     # Notes CRUD routes
│   │   └── server.js              # Express server setup
│   ├── package.json
│   └── vercel.json                # Vercel deployment config
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation component
│   │   │   ├── NoteCard.jsx       # Task card component
│   │   │   ├── NotesNotFound.jsx  # Empty state component
│   │   │   └── RateLimitedUI.jsx  # Rate limit error component
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   ├── lib/
│   │   │   ├── axios.js           # Axios configuration
│   │   │   └── utils.js           # Utility functions
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Main task list page
│   │   │   ├── CreatePage.jsx     # Create task page
│   │   │   └── NoteDetailPage.jsx # Edit task page
│   │   ├── App.jsx                # Main app component
│   │   └── main.jsx               # React entry point
│   ├── package.json
│   └── vite.config.js             # Vite configuration
└── README.md
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback handler
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user

### Notes/Tasks
- `GET /api/notes` - Get all notes for authenticated user (requires auth)
- `GET /api/notes/:id` - Get note by ID (requires auth)
- `POST /api/notes` - Create new note (requires auth)
- `PUT /api/notes/:id` - Update note (requires auth)
- `DELETE /api/notes/:id` - Delete note (requires auth)

### Health Check
- `GET /api/health` - Health check endpoint

## Deployment

### Vercel Deployment

1. **Backend Deployment**:
   - Connect GitHub repository to Vercel
   - Set root directory to `backend`
   - Configure environment variables in Vercel dashboard
   - Deploy

2. **Frontend Deployment**:
   - Connect GitHub repository to Vercel
   - Set root directory to `frontend`
   - Set `VITE_BACKEND_URL` environment variable
   - Deploy

3. **Required Environment Variables** (Backend):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` (production URL)
   - `FRONTEND_URL` (production frontend URL)
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `VERCEL=1` (automatically set by Vercel)

4. **Required Environment Variables** (Frontend):
   - `VITE_BACKEND_URL` (production backend URL)

### Post-Deployment Checklist

- [ ] Update Google OAuth redirect URI to production URL
- [ ] Verify CORS configuration allows frontend domain
- [ ] Test authentication flow in production
- [ ] Verify cookies are set correctly (check browser DevTools)
- [ ] Test all CRUD operations
- [ ] Verify rate limiting is working

## License

ISC

## Author

Developed as an assignment project demonstrating full-stack MERN development skills by LOVISH JINDAL.

---

**Note**: This README and all project documentation were written independently without AI assistance, as per assignment requirements.

