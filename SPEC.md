# ARLINDO DIGITAL CRM V2.0 - Specification Document

## Project Overview

**Project Name:** Arlindo Digital CRM V2.0  
**Type:** Full-stack Web Application (CRM)  
**Version:** V2.0 (Latest)
**Created by:** Gusti Dewa Anggading  
**Year:** 2026  
**Purpose:** Campus marketing CRM for managing prospective student leads, tracking follow-ups, and monitoring marketing performance

---

## What's New in V2.0

- **Staff Performance Overview** - Admin can now track staff performance
- **Leads by Team Visualization** - Visual representation of leads by team
- **Enhanced Lead Management** - Additional fields: Registration Type, Class Type
- **Improved Pipeline** - 6-column Kanban with drag & drop
- **Better Task Management** - 3-column Kanban with priority levels
- **Export Functionality** - Export to Excel and PDF for leads and reports
- **JWT Authentication** - Secure login system with password encryption
- **Role-based Access** - Master Admin, Admin, and User roles

---

## Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- Shadcn UI components
- Recharts (charts)
- Lucide React (icons)
- React Router DOM
- Zustand (state management)

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- multer (file uploads)

### Database
- SQLite

---

## UI Design System

### Color Palette
- **Primary:** #1e3a8a (Navy Blue)
- **Primary Light:** #3b82f6 (Blue)
- **Primary Dark:** #1e293b (Dark Navy)
- **Accent:** Linear gradient from #3b82f6 to #06b6d4
- **Background:** #f8fafc (Soft Gray)
- **Card:** #ffffff (White)
- **Border:** #e2e8f0 (Light Gray)
- **Text Primary:** #1e293b
- **Text Secondary:** #64748b
- **Success:** #10b981
- **Warning:** #f59e0b
- **Error:** #ef4444
- **Hot Lead:** #dc2626

### Typography
- **Font Family:** system-ui, 'Inter', -apple-system, sans-serif
- **Headings:** Bold, various sizes (h1: 2rem, h2: 1.5rem, h3: 1.25rem)
- **Body:** Regular, 1rem
- **Small:** 0.875rem

### UI Elements
- **Border Radius:** 0.5rem (cards), 0.375rem (buttons), 0.25rem (inputs)
- **Shadows:** Soft shadows (shadow-sm, shadow-md)
- **Animations:** Smooth transitions (150ms ease-in-out)
- **Icons:** Lucide React icons

### Layout
- **Sidebar:** Fixed left, 256px width, dark navy background
- **Top Navbar:** Fixed top, white background, 64px height
- **Main Content:** Padding 24px, responsive grid

---

## Authentication System

### Login Page Layout
**Left Side (Branding):**
- Logo placeholder (icon)
- Title: "Arlindo Digital CRM"
- Headline: "Kelola Lead Kampus Lebih Cepat, Lebih Terstruktur, dan Lebih Profesional."
- Subheadline: "Satu sistem untuk mengelola database calon mahasiswa, memantau follow up marketing, dan meningkatkan konversi pendaftaran kampus."
- Background: Blue gradient (#3b82f6 to #06b6d4) with abstract shapes

**Right Side (Login Form):**
- Card with white background
- Fields: Username, Password
- Features: Show/hide password toggle, Remember me checkbox
- Loading state on button
- Error message display
- Login button: "Masuk ke Dashboard"

### Default Master Admin
- **Username:** Dewa
- **Password:** Dewa123
- **Role:** Admin
- Created automatically on first run

---

## Module Specifications

### 1. Dashboard Module
**Route:** `/dashboard`

**Statistics Cards (4 cards):**
- Total Leads (count)
- New Leads (count, current month)
- Registered Students (count)
- Hot Leads (count)

**Charts:**
- Lead Status Distribution (Bar Chart) - 7 statuses
- Lead Source Distribution (Pie Chart)

**Lists:**
- Upcoming Follow Ups (5 nearest)
- Recent Activities (last 10)

### 2. Lead Management Module
**Route:** `/leads`

**Table Columns:**
| Column | Type |
|--------|------|
| Name | Text |
| WhatsApp | Phone |
| Email | Email |
| School | Text |
| Program Interest | Text |
| Lead Source | Text |
| Status | Badge |
| Priority | Badge |
| Next Follow Up | Date |

**Lead Status Options:**
- New (blue)
- Contacted (yellow)
- Follow Up (orange)
- Interested (purple)
- Registered (green)
- Enrolled (teal)
- Lost (red)

**Priority Options:**
- Low (gray)
- Medium (blue)
- High (orange)
- Hot (red)

**Features:**
- Search by name/email/phone
- Filter by status
- Filter by source
- Bulk select with checkboxes
- Bulk delete
- Export to PDF
- Export to Excel
- Add New Lead button
- Row click opens lead detail

### 3. Lead Detail Page
**Route:** `/leads/:id`

**Sections:**
- Personal Info (name, phone, email)
- Education Info (school, program interest)
- Lead Source
- Notes (textarea)
- Follow Up History (list)

**Actions:**
- Edit button
- Delete button
- Send WhatsApp (opens https://wa.me/{phone})

### 4. Pipeline Module (Kanban)
**Route:** `/pipeline`

**Columns (6):**
1. New
2. Contacted
3. Follow Up
4. Interested
5. Registered
6. Enrolled

**Card Features:**
- Lead name
- Priority badge
- Program interest
- Next follow up date
- WhatsApp quick action button

**Interactions:**
- Drag and drop between columns
- Click to open detail

### 5. Customers Module
**Route:** `/customers`

**Display:** Card list (grid)

**Card Fields:**
- Avatar (initials)
- Name
- Email
- Program
- School
- Join Date

### 6. Follow Up Module
**Route:** `/follow-ups`

**Sections (Tabs):**
- Overdue
- Today
- Upcoming

**Table Fields:**
- Lead Name
- Program
- Status
- Priority
- Follow Up Date
- Notes

**Actions:**
- Send WhatsApp
- Mark as Completed

### 7. Task Management Module
**Route:** `/tasks`

**Kanban Board:**
- To Do
- In Progress
- Done

**Task Card Fields:**
- Title
- Description
- Priority (badge)
- Due Date

**Actions:**
- Create task modal
- Edit task modal
- Delete task
- Drag between columns

### 8. Reports Module
**Route:** `/reports`

**Metrics Cards:**
- Total Leads
- Conversion Rate (%)
- Hot Leads
- Lost Rate (%)

**Charts:**
- Lead Status Funnel (Bar chart)
- Lead Sources Pie Chart
- Program Interest Chart

**Export:**
- Export PDF button
- Export Excel button

### 9. Marketing Sources Module
**Route:** `/sources`

**Table Fields:**
- Source Name
- Type (badge)
- Budget
- Total Leads
- Conversions
- Conversion Rate

**Source Types:**
- Social Media
- Event
- Digital Ads
- Offline
- Referral

### 10. Document Management
**Route:** `/documents`

**Table Fields:**
- Title
- Category (badge)
- Description
- File (preview/download)
- Google Drive Link

**Categories:**
- Proposal
- Brochure
- Template
- Contract
- Report

**Actions:**
- Preview image
- Preview PDF
- Open Google Drive link
- Download file
- Upload new document

### 11. User Management
**Route:** `/users`

**Admin only access**

**Table Fields:**
- Name
- Email
- Role (badge)
- Join Date
- Actions (edit/delete)

**Roles:**
- Admin (full access)
- User (limited access)

**Actions:**
- Invite new user
- Edit user
- Delete user

### 12. Activity Log
**Route:** `/activity`

**Table Fields:**
- Lead Name
- Action (badge)
- Description
- User
- Timestamp

**Action Types:**
- created
- updated
- deleted
- status_changed
- contacted_wa
- follow_up_scheduled
- exported

### 13. Settings Page
**Route:** `/settings`

**Sections:**
- Profile Information
  - Full Name
  - Email
  - Phone
  - Role (read-only)
  
- Notification Toggles
  - Follow Up Reminder
  - New Lead Alert
  - Lead Status Change

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (admin only)
- `GET /api/auth/me` - Get current user

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `DELETE /api/leads/bulk` - Bulk delete
- `POST /api/leads/export` - Export leads

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Sources
- `GET /api/sources` - Get all sources
- `POST /api/sources` - Create source
- `PUT /api/sources/:id` - Update source
- `DELETE /api/sources/:id` - Delete source

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Upload document
- `DELETE /api/documents/:id` - Delete document

### Activities
- `GET /api/activities` - Get activities

### Follow-ups
- `GET /api/follow-ups` - Get follow-ups
- `PUT /api/follow-ups/:id` - Update follow-up

### Reports
- `GET /api/reports/stats` - Get statistics

---

## Database Schema

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| username | TEXT | UNIQUE |
| password | TEXT | |
| name | TEXT | |
| email | TEXT | |
| phone | TEXT | |
| role | TEXT | DEFAULT 'user' |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### leads
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| name | TEXT | |
| phone | TEXT | |
| email | TEXT | |
| school | TEXT | |
| program | TEXT | |
| source | TEXT | |
| status | TEXT | DEFAULT 'new' |
| priority | TEXT | DEFAULT 'medium' |
| notes | TEXT | |
| next_follow_up | DATETIME | |
| registered_at | DATETIME | |
| enrolled_at | DATETIME | |
| created_by | INTEGER | FOREIGN KEY |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | |

### tasks
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| title | TEXT | |
| description | TEXT | |
| priority | TEXT | DEFAULT 'medium' |
| status | TEXT | DEFAULT 'todo' |
| due_date | DATETIME | |
| created_by | INTEGER | FOREIGN KEY |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | |

### sources
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| name | TEXT | |
| type | TEXT | |
| budget | REAL | DEFAULT 0 |
| total_leads | INTEGER | DEFAULT 0 |
| conversions | INTEGER | DEFAULT 0 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### documents
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| title | TEXT | |
| category | TEXT | |
| description | TEXT | |
| file_path | TEXT | |
| drive_link | TEXT | |
| created_by | INTEGER | FOREIGN KEY |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### activities
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| lead_id | INTEGER | FOREIGN KEY |
| user_id | INTEGER | FOREIGN KEY |
| action | TEXT | |
| description | TEXT | |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### follow_ups
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| lead_id | INTEGER | FOREIGN KEY |
| notes | TEXT | |
| follow_up_date | DATETIME | |
| completed | INTEGER | DEFAULT 0 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

---

## File Structure

```
/client
  /src
    /components
      /ui (shadcn components)
      /layout (Sidebar, Navbar)
      /common (Button, Input, etc.)
    /pages
      /auth (Login)
      /dashboard
      /leads
      /pipeline
      /customers
      /follow-ups
      /tasks
      /reports
      /sources
      /documents
      /users
      /settings
      /activity
    /hooks
    /store (Zustand stores)
    /lib (utils)
    /styles
  index.html
  package.json
  vite.config.js
  tailwind.config.js

/server
  /routes
  /controllers
  /models
  /middleware
  database.js
  server.js
  package.json

/package.json (root)
```

---

## Acceptance Criteria

1. ✅ Login page displays with branding and form
2. ✅ Default admin can login with Dewa/Dewa123
3. ✅ Dashboard shows statistics and charts
4. ✅ Can create, read, update, delete leads
5. ✅ Pipeline shows Kanban board with drag-drop
6. ✅ Can manage tasks in Kanban board
7. ✅ Reports show analytics with charts
8. ✅ Can manage marketing sources
9. ✅ Can upload and manage documents
10. ✅ User management works (admin only)
11. ✅ Activity log tracks all actions
12. ✅ Settings page allows profile updates
13. ✅ Responsive design works on all screens
14. ✅ Application runs with npm install && npm run dev

