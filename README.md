# 📚 Library Management System

A modern full-stack Library Management System developed using **Node.js, Express.js, MySQL, EJS, Bootstrap, and Chart.js** for efficient management of books, students, library circulation, fines, and analytics.

This project was developed as a **DBMS Mini Project** for academic purposes and demonstrates practical implementation of important Database Management System concepts such as:

* CRUD Operations
* Relational Databases
* Foreign Keys
* Transactions
* Constraints
* Referential Integrity
* Data Validation
* Session Management
* Reporting & Analytics

---

# 🚀 Features

## 🔐 Authentication System

* Admin login system
* Session-based authentication
* Protected routes
* Secure admin dashboard access

---

## 📖 Book Management

* Add new books
* Edit book details
* Delete books
* Search books
* Track quantity and availability
* Prevent deletion of books with issue history

### Book Details Stored

* Title
* Author
* Category
* Quantity
* Available Copies

---

## 👨‍🎓 Student Management

* Add students
* Edit student information
* Delete students
* Search students
* Unique USN validation

### Student Details Stored

* Name
* USN
* Department
* Phone Number

---

## 🔄 Book Issue & Return System

* Issue books to students
* Return books
* Due date tracking
* Automatic availability update
* Transaction handling using MySQL transactions
* Prevent issuing unavailable books

### Issue Workflow

1. Student selects a book
2. Issue record created
3. Book availability decreases
4. Due date assigned
5. Return updates availability automatically

---

# 💰 Fine Management

* Automatic overdue fine calculation
* Fine records stored in database
* Paid / Unpaid status tracking
* Mark fine as paid
* Fine analytics

### Fine Rules

* Fine generated automatically for overdue returns
* Fine stored permanently in database
* Fine records linked to issue history

---

# 📊 Dashboard Analytics

The dashboard provides:

* Total Books
* Total Students
* Active Issued Books
* Overdue Books
* Fine Statistics
* Library Analytics Charts

Built using:

* Chart.js
* Dynamic MySQL queries

---

# 🕘 Issue History

Complete transaction history including:

* Student details
* Book details
* Issue date
* Due date
* Return date
* Current status

---

# 🎨 Modern UI Features

* Professional RV University inspired interface
* Responsive layout
* Sidebar navigation
* Dashboard cards
* Modern tables
* Status badges
* Alerts and notifications
* Analytics visualization

---

# 🛠️ Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* EJS
* Bootstrap
* Chart.js

## Backend

* Node.js
* Express.js

## Database

* MySQL

## Other Packages

* mysql2
* express-session
* body-parser
* connect-flash

---

# 🗄️ Database Design

## Tables Used

### 1. students

| Column     | Type    |
| ---------- | ------- |
| id         | INT     |
| name       | VARCHAR |
| usn        | VARCHAR |
| department | VARCHAR |
| phone      | VARCHAR |

---

### 2. books

| Column    | Type    |
| --------- | ------- |
| id        | INT     |
| title     | VARCHAR |
| author    | VARCHAR |
| category  | VARCHAR |
| quantity  | INT     |
| available | INT     |

---

### 3. issued_books

| Column      | Type |
| ----------- | ---- |
| id          | INT  |
| student_id  | INT  |
| book_id     | INT  |
| issue_date  | DATE |
| due_date    | DATE |
| return_date | DATE |

---

### 4. fines

| Column      | Type    |
| ----------- | ------- |
| id          | INT     |
| issue_id    | INT     |
| amount      | DECIMAL |
| paid_status | VARCHAR |

---

# 🔗 Relationships

* One student → many issued books
* One book → many issue records
* One issue → one fine record

Implemented using:

* Primary Keys
* Foreign Keys
* Relational Mapping

---

# ⚡ DBMS Concepts Implemented

| Concept                    | Implemented |
| -------------------------- | ----------- |
| CRUD Operations            | ✅           |
| Primary Keys               | ✅           |
| Foreign Keys               | ✅           |
| Constraints                | ✅           |
| Transactions               | ✅           |
| Referential Integrity      | ✅           |
| Data Validation            | ✅           |
| Search Queries             | ✅           |
| Joins                      | ✅           |
| Session Management         | ✅           |
| Relational Database Design | ✅           |

---

# 📂 Project Structure

```bash
library-management-system/
│
├── db/
│   └── db.js
│
├── public/
│
├── routes/
│   ├── auth.js
│   ├── books.js
│   ├── students.js
│   ├── issue.js
│   ├── return.js
│   ├── fines.js
│   └── history.js
│
├── views/
│   ├── dashboard.ejs
│   ├── books.ejs
│   ├── students.ejs
│   ├── fines.ejs
│   ├── history.ejs
│   ├── issue-book.ejs
│   ├── return-book.ejs
│   ├── edit-book.ejs
│   ├── edit-student.ejs
│   ├── login.ejs
│   ├── _sidebar.ejs
│   └── _layout.ejs
│
├── server.js
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/chinmay6537/LMS.git
```

---

## 2. Open Project

```bash
cd LMS
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure MySQL Database

Create database:

```sql
CREATE DATABASE library_management;
```

Import required tables using SQL schema.

---

## 5. Configure Database Connection

Edit:

```bash
db/db.js
```

Update:

```js
host
user
password
database
```

---

## 6. Run Project

```bash
npm run dev
```

or

```bash
node server.js
```

---

## 7. Open Browser

```bash
http://localhost:5050
```

---

# 📸 Suggested Screenshots

Add screenshots of:

* Login Page
* Dashboard
* Book Management
* Student Management
* Fine Management
* Issue History
* Analytics Dashboard

---

# 🎯 Objective

The main objective of this project is to digitize and simplify library management operations while implementing practical DBMS concepts in a real-world application.

This system helps:

* Reduce manual work
* Improve record management
* Track books efficiently
* Maintain proper transaction history
* Manage overdue fines
* Generate analytics and reports

---

# 🧠 Learning Outcomes

Through this project, the following concepts were learned and implemented:

* Backend development using Node.js
* MySQL relational database design
* Session handling and authentication
* RESTful routing
* EJS templating
* Database normalization
* Transaction handling
* Git & GitHub workflow
* UI/UX design principles

---

# 👨‍💻 Developed By

Atharva SM
Chandra Sriyanth
Chinmay S

RV University

DBMS Mini Project

---
