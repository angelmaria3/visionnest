
<img width="1280" height="640" alt="img" src="https://github.com/user-attachments/assets/bbea67d5-aaf1-4ce0-8cce-97cc8d9f7939" />

# VisionNest 🎯

## Basic Details

### Team Name: Invectoz

### Team Members
- Member 1: Angel Maria Sunil - RIT Kottayam 
- Member 2: Gopika S - RIT Kottayam  

### Hosted Project Link
[mention your project hosted link here]

### Project Description
VisionNest is a goal-tracking web application that helps users break down long-term visions into manageable tasks. It allows users to track progress visually, mark tasks as completed, and upload proof images for milestones. The platform ensures structured planning and consistent goal achievement.

### The Problem statement
Many people set ambitious goals but fail to track their progress effectively. Traditional to-do apps lack structured long-term vision planning and motivational proof tracking, which leads to inconsistency and goal abandonment.

### The Solution
VisionNest transforms long-term goals into structured task checklists with progress tracking and proof-of-completion image uploads. By combining goal structuring, visual progress indicators, and milestone documentation, it increases accountability and motivation.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: JavaScript  
- Frameworks used: React (Vite)  
- Libraries used: React Router DOM , Supabase JS Client  
- Tools used: VS Code , Git & GitHub Supabase (Database, Auth, Storage) , Vercel (Deployment) 

---

## Features

List the key features of your project:
- Feature 1: Create long-term visions with title and description  
- Feature 2: Break visions into structured tasks with completion tracking 
- Feature 3: Automatic dynamic progress calculation  
- Feature 4: Upload and view proof images for completed tasks  
- Feature 5: Secure user-specific data using Supabase Row Level Security 

---

## Implementation

### For Software:

#### Installation
```bash
git clone https://github.com/your-username/visionnest.git
cd visionnest
npm install
```

#### Run
```bash
npm run dev

```
---

## Project Documentation

### For Software:

#### Screenshots 

<img width="1919" height="1199" alt="Screenshot 2026-02-14 075549" src="https://github.com/user-attachments/assets/d6eb85d5-c068-4c7a-8b99-c3c0e15d94c8" />



Landing Page - The landing page of VisionNest introduces the platform with a calming gradient background and motivational tagline, encouraging users to start tracking their goals. The “Get Started” button guides users to authentication.



<img width="1919" height="1199" alt="Screenshot 2026-02-14 075605" src="https://github.com/user-attachments/assets/580e0a98-c52d-482d-9d16-c2e57be43ed0" />



Login Page - Secure login interface powered by Supabase Authentication. Users can enter their email and password to access their personalized vision dashboard or navigate to account creation if they are new.



<img width="1919" height="1199" alt="Screenshot 2026-02-14 075619" src="https://github.com/user-attachments/assets/94565460-37a4-42c1-af77-a66af4b7e6fb" />



Vision Dashboard - The main dashboard displaying all created visions (e.g., Travel, Art, Daily Workout). Users can add new visions or open existing ones to manage tasks and track progress.



<img width="1919" height="1199" alt="Screenshot 2026-02-14 075636" src="https://github.com/user-attachments/assets/05837b74-4e2e-40fd-985a-574240b1b266" />



Add New Vision - A modal interface for creating a new vision. Users can enter a vision title and a short description, which gets stored securely in the database and linked to their account.


<img width="1919" height="1198" alt="Screenshot 2026-02-14 075721" src="https://github.com/user-attachments/assets/120d86a8-5bda-452a-9ec9-ad401130d95f" />



Vision Detail & Task Management - Detailed view of a selected vision showing task breakdown, dynamic progress tracking, task completion toggles, and milestone image uploads. Completed tasks allow proof image uploads stored securely in Supabase Storage.


#### Diagrams

**System Architecture:**

![sysarch](https://github.com/user-attachments/assets/1f395e2b-38e9-469c-964e-06a4b79abcec)


VisionNest follows a client–backend architecture where the React frontend communicates directly with Supabase using the Supabase JavaScript SDK. Supabase handles Authentication, PostgreSQL database operations (visions & tasks), and Storage for uploaded task images. Row Level Security (RLS) ensures each user can only access their own data. The frontend manages UI rendering, state updates, and optimistic UI interactions while Supabase manages persistence and security.


**Application Workflow:**

![applworkflow](https://github.com/user-attachments/assets/2bb05df8-0fb3-4711-84c4-d9c948c735ba)


- User Authentication
The user logs in securely using Supabase Authentication. All data is scoped to the authenticated user using Row Level Security (RLS).

- Vision Creation
The user creates a new vision by adding a title and description. This represents a long-term goal they want to achieve.

- Task Breakdown
Each vision can be broken down into smaller, actionable tasks. These tasks are stored in the database and linked to the specific vision.

- Progress Tracking
As tasks are marked complete, the progress bar dynamically updates in real-time based on the ratio of completed tasks to total tasks.

- Milestone Proof Upload
When a task is completed, users can upload proof images (stored securely in Supabase Storage under user-specific folders).

- Image Viewing & Fullscreen Preview
Users can view uploaded images inside a modal and expand them to fullscreen mode for a better visual experience.

- Data Persistence & Security
All data (visions, tasks, images) is securely stored in Supabase PostgreSQL and Storage with RLS policies ensuring users can only access their own content.

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `https://VisionNest.supabase.co`

##### Endpoints

> VisionNest uses Supabase as a Backend-as-a-Service (BaaS).  
> All authentication, database operations, and storage are handled via the Supabase JavaScript SDK.

---

## 🔐 Authentication

Authentication is handled securely using **Supabase Auth**.

### Login
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt-token"
  }
}
```

---

### Signup
```javascript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
});
```

**Description:**  
Creates a new authenticated user and stores credentials securely.

---

## 📌 Vision Management

### Create Vision
```javascript
await supabase.from("visions").insert({
  user_id: user.id,
  title: "Learn React",
  description: "Master frontend development",
  completed: false
});
```

**Response:**
```json
{
  "status": "success",
  "message": "Vision created successfully"
}
```

---

### Fetch User Visions
```javascript
await supabase
  .from("visions")
  .select("*")
  .eq("user_id", user.id);
```

---

## ✅ Task Management

### Create Task
```javascript
await supabase.from("tasks").insert({
  title: "Complete React tutorial",
  vision_id: visionId,
  user_id: user.id,
  completed: false
});
```

---

### Toggle Task Completion
```javascript
await supabase
  .from("tasks")
  .update({ completed: true })
  .eq("id", taskId);
```

---

### Delete Task
```javascript
await supabase
  .from("tasks")
  .delete()
  .eq("id", taskId);
```

---

## 🖼 Image Upload (Supabase Storage)

### Upload Image
```javascript
await supabase.storage
  .from("task-images")
  .upload(filePath, file);
```

---

### Get Public Image URL
```javascript
const { data } = supabase.storage
  .from("task-images")
  .getPublicUrl(filePath);
```

---

## 🔒 Security Implementation

- Row Level Security (RLS) enabled on `visions` and `tasks`
- Users can only access their own data
- Storage policies restrict access to user-specific folders
- JWT-based authentication via Supabase

---

#### Installation Guide

## 🚀 Running VisionNest Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/VisionNest.git
cd VisionNest
```

---

### 2️⃣ Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend (AI Server - if using Gemini/OpenRouter)
```bash
cd server
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in the root folder:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If using AI server (inside `/server` folder):

```env
OPENROUTER_API_KEY=your-api-key
```

---

### 4️⃣ Run the Project

#### Start Frontend (Vite)
```bash
npm run dev
```

Frontend will run at:
```
http://localhost:5173
```

#### Start Backend Server (Optional - For AI task generation)
```bash
npm run server
```

Backend runs at:
```
http://localhost:5000
```

---

## 📦 Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 🌐 Deployment

You can deploy the frontend to:
- Vercel
- Netlify
- GitHub Pages

Supabase handles:
- Authentication
- PostgreSQL Database
- Storage
- Row Level Security

No additional server setup required for production (unless using custom AI backend).

---

## Project Demo

### 🎥 Video

🔗 Demo Video Link: https://drive.google.com/file/d/1mMT63gb6zjW5gGPHdE-E_ic96rrY5Thc/view?usp=sharing

**What the demo showcases:**

The demo walks through the complete VisionNest workflow:

- 🔐 Secure user authentication using Supabase Auth  
- 🎯 Creating a new vision with title and description  
- 🤖 Automatic AI-powered task breakdown (goal → actionable steps)  
- ✅ Marking tasks as completed with real-time progress tracking  
- 📊 Dynamic progress bar updates  
- 🖼 Uploading proof images for completed tasks  
- 👀 Viewing uploaded images inside a modal  
- 🔍 Fullscreen image preview functionality  
- 🔒 Secure data isolation using Row Level Security (RLS)

The video highlights how VisionNest transforms a long-term goal into a structured, trackable, and visually documented achievement system.

---

## AI Tools Used 

**Tool Used:** ChatGPT

**Purpose:**
- Debugging Supabase RLS policies
- Optimizing React state management
- Designing storage folder structure

Writing documentation

**Key Prompts Used:**
- "Fix Supabase storage policy error"
- "Implement optimistic UI toggle"
- "Create storage RLS policy for user-specific folders"

**Percentage of AI-generated code:** ~25–30%
**Human Contributions:**
- Architecture design
- Feature implementation
- UI styling decisions
- Database schema design
- Debugging & testing
  
---

## Team Contributions

- Angel Maria Sunil – Frontend development, UI/UX design, React components
- Gopika S – Backend integration (Supabase), RLS policies, Storage implementation, Debugging & Testing
---

## License

This project is licensed under the MIT License.

---

Made with ❤️ at TinkerHub
