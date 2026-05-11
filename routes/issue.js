const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/issue-book", (req, res) => {

  if (!req.session.admin) {
    return res.redirect("/login");
  }

  const studentSql = "SELECT * FROM students";
  const bookSql = "SELECT * FROM books WHERE available > 0";

  db.query(studentSql, (err, students) => {

    if (err) throw err;

    db.query(bookSql, (err, books) => {

      if (err) throw err;

      res.render("issue-book", {
        students,
        books
      });

    });

  });

});

router.post("/issue-book", (req, res) => {

  const {
    student_id,
    book_id,
    issue_date,
    due_date
  } = req.body;

  db.beginTransaction((err) => {

    if (err) throw err;

    const insertSql = `
      INSERT INTO issued_books
      (student_id, book_id, issue_date, due_date)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [
        student_id,
        book_id,
        issue_date,
        due_date
      ],
      (err) => {

        if (err) {

          return db.rollback(() => {
            throw err;
          });

        }

        const updateSql = `
          UPDATE books
          SET available = available - 1
          WHERE id = ?
        `;

        db.query(updateSql, [book_id], (err) => {

          if (err) {

            return db.rollback(() => {
              throw err;
            });

          }

          db.commit((err) => {

            if (err) {

              return db.rollback(() => {
                throw err;
              });

            }

            req.flash(
              "success",
              "Book Issued Successfully"
            );

            res.redirect("/issue-book");

          });

        });

      }
    );

  });

});

module.exports = router;
