const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/history", (req, res) => {

  const sql = `
    SELECT

      issued_books.id,

      students.name AS student_name,

      students.usn,

      books.title AS book_title,

      issued_books.issue_date,

      issued_books.due_date,

      issued_books.return_date

    FROM issued_books

    JOIN students
    ON issued_books.student_id = students.id

    JOIN books
    ON issued_books.book_id = books.id

    ORDER BY issued_books.id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) throw err;

    res.render("history", {
      history: results
    });

  });

});

module.exports = router;
