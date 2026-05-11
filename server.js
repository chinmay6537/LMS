const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const flash = require("connect-flash");
const fineRoutes = require("./routes/fines");
const historyRoutes = require("./routes/history");

const db = require("./db/db");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const studentRoutes = require("./routes/students");
const issueRoutes = require("./routes/issue");
const returnRoutes = require("./routes/return");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "library_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {

  res.locals.success = req.flash("success");

  next();

});

app.use("/", authRoutes);
app.use("/", bookRoutes);
app.use("/", studentRoutes);
app.use("/", issueRoutes);
app.use("/", returnRoutes);
app.use("/", fineRoutes);
app.use("/", historyRoutes);

app.get("/", (req, res) => {
  res.send("Library Management System Running");
});

app.get("/dashboard", (req, res) => {

  if (!req.session.admin) {
    return res.redirect("/login");
  }

  const totalBooksSql =
    "SELECT COUNT(*) AS totalBooks FROM books";

  const totalStudentsSql =
    "SELECT COUNT(*) AS totalStudents FROM students";

  const issuedBooksSql =
    `
    SELECT COUNT(*) AS issuedBooks
    FROM issued_books
    WHERE return_date IS NULL
    `;

  const overdueSql =
    `
    SELECT COUNT(*) AS overdueBooks
    FROM issued_books
    WHERE due_date < CURDATE()
    AND return_date IS NULL
    `;

  db.query(totalBooksSql, (err, booksResult) => {

    if (err) throw err;

    db.query(totalStudentsSql, (err, studentsResult) => {

      if (err) throw err;

      db.query(issuedBooksSql, (err, issuedResult) => {

        if (err) throw err;

        db.query(overdueSql, (err, overdueResult) => {

          if (err) throw err;

          res.render("dashboard", {

            totalBooks:
              booksResult[0].totalBooks,

            totalStudents:
              studentsResult[0].totalStudents,

            issuedBooks:
              issuedResult[0].issuedBooks,

            overdueBooks:
              overdueResult[0].overdueBooks

          });

        });

      });

    });

  });

});

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});