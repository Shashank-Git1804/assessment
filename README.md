# Attendance Management System

A role-based attendance management system with 5 distinct user roles: Student, Trainer, Institution, Programme Manager, and Monitoring Officer.

## 🌐 Live URLs

- **Frontend**: https://role-based-authorization.netlify.app/ (or) https://assessment-740kgxdm2-shashank-git1804s-projects.vercel.ap/
- **Backend API**: https://assessment-96h4.onrender.com/
- **API Base URL**: `https://assessment-96h4.onrender.com/api`

## 🔐 Test Accounts

You can use these accounts to test each role:

| Role | Email | Password |
|------|-------|----------|
| **Student** | sk02@test.com | 123456 |
| **Trainer** | sk03t@test.com | 123456 |
| **Institution** | institution@test.com | 123456 |
| **Programme Manager** | pm@test.com | 123456 |
| **Monitoring Officer** | mo@test.com | 123456 |

## 📋 Task 4 & 5 Completion Status

### Deployment Requirements vs Implementation
**Task 4 specified**: Vercel + Railway/Render + PostgreSQL/Neon + Clerk  
**Actually implemented**: Netlify + Render + MongoDB Atlas + JWT

**Why the deviations**:
- **Netlify over Vercel**: Both are equivalent static hosting platforms. Netlify was chosen for its simpler deployment process and better free tier and I am comfortable with it 
- **Render over Railway**: Render was used for backend deployment, works seamlessly with MongoDB Atlasand I am comfortable with it
- **MongoDB over PostgreSQL**: AS I am MERN developer MongoDB feels relatable
- **JWT over Clerk**: I'm very much comfortable with JWT than clerk

### Deployment Status: ✅ FULLY FUNCTIONAL
All components are live and working.

### Deployment Issues Encountered & Fixed
1. **CORS Mismatch**: Netlify URL changed during deployment. Fixed by updating `CLIENT_URL` in Render environment variables
2. **Institution Batches Empty**: Complex query logic was failing. Simplified to direct `institutionId` lookup
3. **Trainer Auto-Assignment**: Trainers weren't being added to batches they created. Fixed by auto-adding trainer to `trainers` array on batch creation
4. **Missing Institution Endpoint**: Added `/api/batches/institution` endpoint to fetch all batches for an institution

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev  # Development with auto-reload
npm start    # Production
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev  # Starts on http://localhost:5173
```

## 🏗️ Schema Design Decisions

### User Model
- Single `User` model for all 5 roles with `role` enum
- `institutionId` field links students/trainers to institutions
- JWT-based authentication with 7-day expiry
- Password hashing with bcryptjs

### Batch Model
- `inviteCode` with `sparse: true` index (unique only when present)
- Arrays for `students` and `trainers` (many-to-many relationships)
- Linked to institution via `institutionId`
- Trainers auto-assigned when batch is created

### Session Model
- `date` stored as Date object for proper filtering
- Time stored as separate `startTime`/`endTime` strings
- Linked to batch and trainer

### Attendance Model
- Compound relationship: `sessionId` + `studentId`
- Status enum: `present`, `absent`, `late`
- `markedAt` timestamp for audit trail

## 🛠️ Stack Choices

### Backend (MERN Stack)
- **Express.js**: Fast, minimal web framework
- **MongoDB + Mongoose**: Document database with ODM, good for rapid prototyping
- **JWT**: Stateless authentication with 7-day expiry
- **bcryptjs**: Password hashing
- **Render**: Backend deployment platform with good MongoDB Atlas integration

### Frontend
- **React 19**: Latest React with modern hooks
- **React Router 7**: Client-side routing
- **Vite**: Fast build tool and dev server
- **Netlify**: Static site deployment with automatic builds

### Database
- **MongoDB Atlas**: Cloud-hosted MongoDB with free tier

### Why These Choices
- **MERN Stack**: Familiar, JavaScript everywhere, fast development
- **MongoDB over PostgreSQL**: Flexible schemas, faster prototyping, no complex migrations
- **JWT over Clerk**: More control over auth flow, no external dependencies, simpler implementation
- **Render over Railway**: Better free tier for backend, easier MongoDB integration
- **Netlify**: Simple deployment, automatic builds from Git, great for React apps

## ✅ What's Working

### Fully Functional
- ✅ User registration/login for all 5 roles
- ✅ JWT authentication with role-based access control
- ✅ Trainer: Create batches (auto-assigned), generate invite codes, create sessions, view attendance
- ✅ Student: Join batches via invite code, view today's active sessions, mark attendance
- ✅ Institution: View all batches with student/trainer lists
- ✅ Programme Manager: View institution-wide attendance statistics
- ✅ Monitoring Officer: View system-wide attendance summary
- ✅ Frontend routing with role-based dashboards
- ✅ API protection with middleware (protect + role-based authorization)
- ✅ CORS configured for cross-origin requests
- ✅ Environment variables properly configured
- ✅ Trainer auto-assignment to batches on creation
- ✅ Session date filtering for today's sessions

## 🔧 Deployment Process

### What Worked
- ✅ Frontend deployed to Netlify successfully with automatic builds
- ✅ Backend deployed to Render with MongoDB Atlas connection
- ✅ Environment variables configured correctly on both platforms
- ✅ CORS configured for cross-origin requests between Netlify and Render
- ✅ MongoDB Atlas connection string working with URL encoding
- ✅ `_redirects` file for Netlify

### Deployment Steps Taken
1. **Frontend (Netlify)**:
   - Connected GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Added `_redirects` file for redirecting
   - Added environment variable: `VITE_API_URL`

2. **Backend (Render)**:
   - Connected GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Added environment variables in Render dashboard
   - Removed `--env-file=.env` flag for production

3. **Database (MongoDB Atlas)**:
   - Created cluster with free tier
   - Configured network access for Render IPs
   - Generated connection string with proper URL encoding

### What Was Tricky
- **Environment Variables**: Different syntax between local (.env) and deployment platforms
- **Date Filtering**: Session dates needed proper Date object comparison, not string matching
- **Trainer Assignment**: Had to add logic to auto-assign trainers to batches they create
- **Batch Membership Validation**: Ensuring students can only mark attendance for sessions in batches they've joined required checking batch membership before allowing attendance marking

## 🎯 One Thing I'd Do Differently With More Time

**Additional Improvements**:
- **Attendance Time Validation**: After session `endTime`, students should not be able to mark attendance. Currently, there's no time-based validation on attendance marking.

## 🧪 How to Test Each Role

### Student Flow
1. Login as sk02@test.com / 123456
2. Join a batch using invite code (get from trainer)
3. View today's active sessions
4. Mark attendance as Present/Late

### Trainer Flow
1. Login as sk03t@test.com / 123456
2. Create a new batch (you'll be auto-assigned)
3. Generate invite code for the batch
4. Create a session for today
5. View attendance for the session

### Institution Flow
1. Login as institution@test.com / 123456
2. View all batches for your institution
3. See list of students and trainers in each batch

### Programme Manager Flow
1. Login as pm@test.com / 123456
2. Enter institution ID to view summary
3. See attendance statistics across all batches

### Monitoring Officer Flow
1. Login as mo@test.com / 123456
2. View system-wide attendance statistics
3. See total/present/late/absent counts

---

**Note**: This is a functional prototype built with the MERN stack. The system works end-to-end with real data persistence, JWT authentication, and role-based access control. All test accounts are pre-created and functional on the live deployment. Issues were encountered during deployment and fixed iteratively - this README documents what actually works, not what was claimed to work.
