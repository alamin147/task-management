# 📌 Flurry: Task Management Platform

A modern task management platform built with the MERN stack, offering a seamless project management experience with features like task tracking, mini-tasks, task sharing, and dynamic status management.

---

## 📖 Description

Flurry is a comprehensive task management platform that allows users to organize projects, create tasks, and track progress with zero distractions. Users can create tasks with detailed descriptions, attach mini-tasks, share projects with team members, and visualize their progress. The platform features a clean and intuitive interface, drag-and-drop functionality, and robust user authentication for secure collaborative work.

This project demonstrates a comprehensive implementation of a project management service with a focus on user experience, collaboration, and task organization.

---

## 🌐 Live URL
[Flurry Frontend](https://task-management-client-zeta.vercel.app)
[Flurry Backend](https://tproject-management-backend.vercel.app)


---

## 🚀 Features

- ✅ User authentication (register/login)
- 🔒 Secure password encryption using bcrypt
- 📝 Full CRUD functionality for tasks and projects
- 📋 Mini-tasks for breaking down larger tasks
- 👥 Task sharing and collaboration
- 🔄 Drag and drop task management
  - Intuitive reordering of subtasks using the six-dot drag handle
  - Real-time visual feedback during drag operations
  - Automatic synchronization with backend after reordering
  - Smooth animations for enhanced user experience
- 📊 Dynamic status tracking for tasks
- 🖼️ Profile management with avatar upload
- 🚩 Customizable task prioritization
- 📅 Task deadlines
- 📱 Responsive design for all devices
- 🎨 **Image Upload for Mini-tasks**
  - Upload and attach images to mini-tasks
  - Image preview functionality with fullscreen view
  - Cloudinary integration for optimized image storage
- 📊 **Advanced Charts and Analytics**
  - Interactive charts using Chart.js and Recharts
  - Doughnut charts for user role distribution
  - Bar charts for task completion analytics
  - Custom tooltips with enhanced styling
- 👑 **Admin Dashboard**
  - Comprehensive user management system
  - User role management (promote/demote users)
  - User account suspension/activation
  - User analytics with completion rates
  - Task statistics and performance metrics
  - Advanced user search and filtering
- 🔄 **Task Duplication**
  - One-click task duplication with all subtasks and mini-tasks
  - Preserves task structure and relationships
- 📈 **Enhanced Task Status Management**
  - Multiple status options (Completed, Pending, In Progress)
  - Visual status indicators with color coding
  - Dynamic status filtering and sorting
- 🎭 **Profile Enhancement**
  - Extended profile editing with bio field
  - Profile photo upload with preview
  - Improved profile management interface

---

## 🧑‍💻 Tech Stack

**Frontend:**
- React
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- Framer Motion
- Ant Design
- DND Kit (for drag and drop functionality)
- Chart.js (for analytics charts)
- Recharts (for advanced data visualization)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Other:**
- JWT (authentication)
- Bcrypt (password hashing)
- Cloudinary (file uploads and image management)
- React Hook Form
- React Hot Toast (notifications/alert)
- SweetAlert2 (enhanced confirmations)


---

## 👥 User Capabilities

- 👤 **Users can:**
  - Create and manage projects
  - Add, edit, delete tasks
  - Create mini-tasks within tasks
  - Upload images to mini-tasks with preview functionality
  - Share projects with other users
  - Reorder the tasks using drag and drop
  - Duplicate tasks with all associated data
  - Customize task status (Completed, Pending, In Progress) and priority
  - Filter tasks by priority and status
  - Manage their profile with photo upload and bio
  - View task analytics and completion rates

- 👑 **Admin users can:**
  - Access comprehensive admin dashboard
  - View system-wide analytics with interactive charts
  - Manage all users (promote/demote roles)
  - Suspend or activate user accounts
  - View detailed user statistics and task completion rates
  - Monitor platform performance and user activity

---

## 📷 Screenshots / Demo

> The application includes multiple key sections:
> -

---

## 🛠️ Installation & Usage (Local)

```bash
# Clone the repository
git clone https://github.com/alamin147/task-management.git

# Navigate to the backend
cd task-management/backend
npm install

# Create .env file in the server directory with required environment variables
# Then start the server
npm start

# Navigate to the frontend
cd ../client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🗂️ Project Structure

```
task-management/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   ├── routes/       # Application routes
│   │   └── types/        # TypeScript interfaces
│   └── ...
├── backend/              # Express backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middlewares
│   │   └── helpers/      # Utility functions
│   └── uploads/          # Media file storage
├── README.md
└── ...
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URI=
CLOUDINARY_FOLDER=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
CLOUDINARY_URL=

```
Create a `.env` file in the `client` directory and add the following:

```


VITE_CLIENT_PROD_URL =
VITE_CLIENT_LOCAL_URL = http://localhost:5173
VITE_SERVER_PROD_URL =
VITE_SERVER_LOCAL_URL = http://localhost:5000


```

---

## 📊 API Documentation

### Authentication Routes
```http
POST /api/user/register         - Register a new user
POST /api/user/login           - Login user and get token

```

### User Routes
```http
GET /api/user/profile          - Get user profile
PUT /api/user/profile          - Update user profile
POST /api/user/avatar          - Upload user avatar
```

### Task Routes
```http
GET /api/tasks                 - Get all tasks
GET /api/tasks/:id             - Get a single task
POST /api/tasks                - Create a new task
PUT /api/tasks/:id             - Update a task
DELETE /api/tasks/:id          - Delete a task
```

### Mini-Task Routes
```http
GET /api/mini-tasks/:taskId    - Get mini-tasks for a task
POST /api/minitask/create      - Create a new mini-task
POST /api/minitask/update      - Update a mini-task (supports image upload)
DELETE /api/minitask/delete/minitask - Delete a mini-task
```

### Card/Project Routes
```http
GET /api/cards                 - Get all cards/projects
POST /api/cards                - Create a new card/project
PUT /api/cards/:id             - Update a card/project
DELETE /api/cards/:id          - Delete a card/project
PATCH /api/card/sub-card/reorder - Reorder subtasks (drag and drop)
POST /api/card/sub-card        - Create a new subtask
PATCH /api/card/sub-card/update - Update a subtask
DELETE /api/card/sub-card/delete - Delete a subtask
```

### Share Routes
```http
POST /api/task/share/:taskId   - Share a task with other users
DELETE /api/task/delete/share/:taskId - Remove shared access
GET /api/task/tasks/share      - Get shared tasks
```

### Admin Routes
```http
GET /api/auth/admin/users/details    - Get all users with detailed stats
GET /api/auth/admin/analytics        - Get system analytics
PATCH /api/auth/admin/users/:id/role - Update user role
PATCH /api/auth/admin/users/:id/status - Toggle user status
DELETE /api/auth/admin/users/:id     - Delete user
```

### Task Enhancement Routes
```http
POST /api/task/duplicate/:taskId     - Duplicate a task with all data
```

---

## 👨‍💻 Created By

[Al Amin](https://github.com/alamin147)
