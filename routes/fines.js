const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/fines", (req, res) => {

  const sql = `
    SELECT

      fines.id,

      fines.amount,

      fines.paid_status,

      students.name AS student_name,

      students.usn,

      books.title AS book_title

    FROM fines

    JOIN issued_books
    ON fines.issue_id = issued_books.id

    JOIN students
    ON issued_books.student_id = students.id

    JOIN books
    ON issued_books.book_id = books.id
  `;

  db.query(sql, (err, results) => {

    if (err) throw err;

    res.render("fines", {
      fines: results
    });

  });

});

router.get("/fines/pay/:id", (req, res) => {

  const sql = `
    UPDATE fines
    SET paid_status = 'Paid'
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err) => {

    if (err) throw err;

    req.flash(
      "success",
      "Fine Marked As Paid"
    );

    res.redirect("/fines");

  });

});

module.exports = router;