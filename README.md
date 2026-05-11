# RV University — Library Management System

A full-stack web application for managing the RV University library. Built with **Node.js**, **Express**, **MySQL**, and **EJS** templates, featuring a modern admin dashboard themed with RV University's maroon and gold identity.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Getting Started](#getting-started)
7. [Environment Setup](#environment-setup)
8. [Running the App](#running-the-app)
9. [Routes Reference](#routes-reference)
10. [UI Theme](#ui-theme)

---

## Project Overview

The RV University Library Management System (LMS) is a web-based admin portal that allows library staff to:

- Manage the book catalogue (add, edit, delete, search)
- Manage enrolled students (add, edit, delete, search)
- Issue books to students with issue and due dates
- Process book returns and automatically calculate overdue fines
- View all fines (paid/unpaid) and a full issue history

The system is protected by an admin login with session-based authentication.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js                           |
| Framework   | Express.js                        |
| Templating  | EJS (Embedded JavaScript)         |
| Database    | MySQL                             |
| Styling     | Custom CSS (Playfair Display + DM Sans fonts) |
| Sessions    | express-session                   |
| Flash msgs  | connect-flash                     |
| Body parser | body-parser                       |

---

## Features

### Authentication
- Admin login with username and password
- Session-based access control — all routes redirect to `/login` if not authenticated
- Logout destroys the session

### Dashboard
- Live counts of total books, enrolled students, currently issued books, and overdue books
- Quick action shortcuts to issue a book, process a return, or manage books

### Books Management (`/books`)
- Add new books (title, author, category, quantity)
- Search books by title, author, or category
- Edit book details
- Delete books (blocked if the book is currently issued to a student)
- Available count tracked separately from total quantity

### Students Management (`/students`)
- Enroll new students (name, USN, department, phone)
- Search students by name, USN, or department
- Edit student details
- Delete students
- Duplicate USN detection on insertion

### Book Issuing (`/issue-book`)
- Select a student and a book from dropdowns
- Only books with `available > 0` are shown
- Set issue date and due date
- Uses a MySQL transaction to insert the issue record and decrement `available` atomically

### Book Returns (`/return-book`)
- Lists all currently issued (unreturned) books
- Shows overdue status and estimated fine inline
- Processes return: sets `return_date`, increments `available`, inserts fine record if overdue

### Fines (`/fines`)
- View all fine records
- Summary cards showing total fines, unpaid amount, and collected amount
- Fine rate: **₹2 per overdue day**

### Issue History (`/history`)
- Complete log of all book transactions (issued and returned)
- Shows student name, USN, book title, issue date, due date, return date, and status

---

## Project Structure

```
project-root/
│
├── server.js               # App entry point — Express setup, session, dashboard route
│
├── db/
│   └── db.js               # MySQL connection (you must create this)
│
├── routes/
│   ├── auth.js             # Login / logout
│   ├── books.js            # CRUD for books
│   ├── students.js         # CRUD for students
│   ├── issue.js            # Issue book (GET form + POST submit)
│   ├── return.js           # Return book (list + process return)
│   ├── fines.js            # View fines
│   └── history.js          # View issue history
│
├── views/
│   ├── _layout.ejs         # Shared CSS variables and component styles
│   ├── _sidebar.ejs        # Shared sidebar navigation partial
│   ├── login.ejs           # Login page
│   ├── dashboard.ejs       # Main dashboard
│   ├── books.ejs           # Books management
│   ├── students.ejs        # Students management
│   ├── issue-book.ejs      # Issue book form
│   ├── return-book.ejs     # Return book table
│   ├── fines.ejs           # Fines list
│   ├── history.ejs         # Issue history
│   ├── edit-book.ejs       # Edit a single book
│   └── edit-student.ejs    # Edit a single student
│
└── public/                 # Static assets (if any)
```

---

## Database Schema

You need a MySQL database with the following tables. Run this SQL to set up your schema:

```sql
CREATE DATABASE rv_library;
USE rv_library;

-- Admin accounts
CREATE TABLE admins (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Insert a default admin (change password before going live)
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');

-- Books catalogue
CREATE TABLE books (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  title     VARCHAR(255) NOT NULL,
  author    VARCHAR(255) NOT NULL,
  category  VARCHAR(100) NOT NULL,
  quantity  INT NOT NULL DEFAULT 1,
  available INT NOT NULL DEFAULT 1
);

-- Enrolled students
CREATE TABLE students (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  usn        VARCHAR(50)  NOT NULL UNIQUE,
  department VARCHAR(100) NOT NULL,
  phone      VARCHAR(20)  NOT NULL
);

-- Book issue records
CREATE TABLE issued_books (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  student_id  INT  NOT NULL,
  book_id     INT  NOT NULL,
  issue_date  DATE NOT NULL,
  due_date    DATE NOT NULL,
  return_date DATE DEFAULT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (book_id)    REFERENCES books(id)
);

-- Fine records (auto-created on overdue return)
CREATE TABLE fines (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  issue_id    INT            NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL,
  paid_status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
  FOREIGN KEY (issue_id) REFERENCES issued_books(id)
);
```

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- MySQL 8.x
- npm

### 1. Clone the repository

```bash
git clone https://github.com/chinmay6537/LMS.git
cd lms
```

### 2. Install dependencies

```bash
npm install express body-parser express-session connect-flash ejs mysql
```

Or if a `package.json` is present:

```bash
npm install
```

---

## Environment Setup

Create the file `db/db.js` with your MySQL connection details:

```javascript
const mysql = require('mysql');

const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',        // your MySQL username
  password: '',            // your MySQL password
  database: 'rv_library'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
  console.log('MySQL connected');
});

module.exports = db;
```

> **Note:** The project uses `mysql` (v2), not `mysql2`. Make sure you install the right package: `npm install mysql`

---

## Running the App

```bash
node server.js
```

The server starts on **port 5050** by default.

Open your browser and go to:

```
http://localhost:5050/login
```

Log in with the admin credentials you inserted into the `admins` table.

---

## Routes Reference

| Method | Route                    | Description                                  | Auth Required |
|--------|--------------------------|----------------------------------------------|---------------|
| GET    | `/login`                 | Show login page                              | No            |
| POST   | `/login`                 | Authenticate admin                           | No            |
| GET    | `/logout`                | Destroy session, redirect to login           | No            |
| GET    | `/dashboard`             | Show dashboard with live stats               | Yes           |
| GET    | `/books`                 | List all books (supports `?search=`)         | Yes           |
| POST   | `/books/add`             | Add a new book                               | Yes           |
| GET    | `/books/edit/:id`        | Show edit form for a book                    | Yes           |
| POST   | `/books/update/:id`      | Save book changes                            | Yes           |
| GET    | `/books/delete/:id`      | Delete a book (blocked if currently issued)  | Yes           |
| GET    | `/students`              | List all students (supports `?search=`)      | Yes           |
| POST   | `/students/add`          | Enroll a new student                         | Yes           |
| GET    | `/students/edit/:id`     | Show edit form for a student                 | Yes           |
| POST   | `/students/update/:id`   | Save student changes                         | Yes           |
| GET    | `/students/delete/:id`   | Delete a student                             | Yes           |
| GET    | `/issue-book`            | Show issue book form                         | Yes           |
| POST   | `/issue-book`            | Issue a book to a student                    | Yes           |
| GET    | `/return-book`           | List all currently issued books              | Yes           |
| GET    | `/return-book/:id`       | Process a book return and calculate fine     | Yes           |
| GET    | `/fines`                 | View all fine records                        | Yes           |
| GET    | `/history`               | View complete issue history                  | Yes           |

---

## UI Theme

The interface is themed around **RV University's visual identity**:

| Token         | Value     | Usage                        |
|---------------|-----------|------------------------------|
| Maroon        | `#7B1C1C` | Sidebar, buttons, headings   |
| Gold          | `#C9A84C` | Accents, badges, highlights  |
| Cream         | `#FDF8F0` | Page background              |
| Body font     | DM Sans   | All body text and UI         |
| Display font  | Playfair Display | Page titles, stat numbers |

**Key UI components:**

- Fixed left sidebar with icon navigation and active state highlighting
- Sticky topbar with page title and admin badge
- Stat cards with coloured bottom accent bars on the dashboard
- Inline add-form panels above management tables
- Status badges: Available / Low Stock / Out of Stock for books; Returned / Issued for history
- Overdue rows highlighted in red with estimated fine shown inline on the Return page
- Avatar initials auto-generated from student names

---

## Fine Calculation

Fines are calculated at the time of return in `routes/return.js`:

```
fine = max(0, days_overdue × ₹2)
```

Where `days_overdue = ceil((return_date - due_date) in days)`.

A fine record is only inserted into the `fines` table if the fine amount is greater than zero.

---

## License

This project was built for academic purposes as part of a DBMS course at RV University, Bengaluru.
