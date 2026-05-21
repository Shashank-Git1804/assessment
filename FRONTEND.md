## Frontend Documentation - Attendance Management System

The frontend of the Attendance Management System was developed using React 19 with Vite to create a user-friendly and interactive interface. The design focuses on simplicity, clarity, and role-based functionality, allowing users to efficiently interact with the system based on their assigned role.

### Main Interface Architecture

The application implements a role-based dashboard system with five distinct user interfaces:

#### 1. Student Dashboard
The Student interface provides functionality for joining batches and marking attendance. The dashboard is divided into two primary sections: batch management and session attendance.

The first section consists of a "Join Batch" form where students can input their batch ID and invite code to join a batch. The form is designed with clearly labeled input fields and a submission button, ensuring ease of data entry.

The second section displays "My Batches" - a list of batches the student has joined, and "Today's Active Sessions" - a structured table showing available sessions for the current day. The table includes columns such as session title, start time, and end time. Each session row includes action buttons ("Present" and "Late") enabling students to mark their attendance directly from the interface.

#### 2. Trainer Dashboard
The Trainer interface provides comprehensive batch and session management capabilities. The dashboard includes:

- **Create Batch Form**: Allows trainers to create new batches with a name field. Upon creation, the trainer is automatically assigned to the batch.
- **Batch List**: Displays all batches created by the trainer with options to generate invite codes and create sessions.
- **Session Management**: Trainers can create sessions for their batches by specifying the session title, date, start time, and end time.
- **Attendance Tracking**: A table displaying attendance records for each session, showing student names, emails, and their attendance status (present, late, absent).

#### 3. Institution Dashboard
The Institution interface provides oversight of all batches within the institution. The dashboard includes:

- **Batch Summary Form**: Allows institution administrators to enter a batch ID to view detailed information.
- **Batch Details Display**: Shows comprehensive batch information including:
  - Batch name
  - Number of students enrolled
  - Number of trainers assigned
  - Complete list of students with their names and emails
  - Complete list of trainers with their names and emails

The structured tabular format ensures organized presentation of all stored data.

#### 4. Programme Manager Dashboard
The Programme Manager interface provides institution-wide attendance statistics. The dashboard includes:

- **Institution Selection Form**: Allows programme managers to enter an institution ID to view statistics.
- **Attendance Summary**: Displays aggregated attendance data across all batches in the selected institution, including:
  - Total sessions
  - Total attendance records
  - Present count
  - Late count
  - Absent count

#### 5. Monitoring Officer Dashboard
The Monitoring Officer interface provides system-wide attendance overview. The dashboard displays:

- **System-wide Statistics**: Aggregated attendance data across the entire system, showing:
  - Total attendance records
  - Total present count
  - Total late count
  - Total absent count

### Design Features

**Navigation and Routing**: The application uses React Router 7 for client-side routing, enabling seamless navigation between different role-based dashboards. Users are automatically redirected to their appropriate dashboard upon login.

**Authentication Context**: A centralized AuthContext manages user authentication state, storing user information and JWT tokens. This ensures secure access control and role-based authorization throughout the application.

**API Integration**: The frontend communicates with the backend through a centralized API module (api.js) that handles all HTTP requests, automatically includes JWT tokens in request headers, and manages error handling.

**Form Handling**: All forms implement proper state management using React hooks (useState), with clear error messaging and success feedback to users.

**Responsive Layout**: The interface uses a clean, consistent styling approach with proper spacing and alignment to enhance readability and user experience across different screen sizes.

**Data Display**: All data is presented in organized tabular formats with clear column headers, making it easy for users to understand and interact with the information.

### User Experience Flow

1. **Login**: Users enter their email and password to authenticate
2. **Role-Based Redirect**: Upon successful authentication, users are automatically redirected to their role-specific dashboard
3. **Dashboard Interaction**: Users interact with features specific to their role
4. **Data Management**: Users can view, create, and manage data relevant to their role
5. **Real-time Updates**: Changes are reflected immediately in the interface after API calls

### Technical Stack

- **React 19**: Latest React with modern hooks for state management
- **React Router 7**: Client-side routing for multi-page navigation
- **Vite**: Fast build tool and development server
- **CSS**: Custom styling for clean, consistent UI
- **Fetch API**: For HTTP communication with backend

### Overall Assessment

The frontend effectively connects user input with backend processing, forming an essential component of the full-stack Attendance Management System. The role-based interface design ensures that each user type has access to only the features and data relevant to their role, while maintaining a consistent and intuitive user experience across all dashboards.
