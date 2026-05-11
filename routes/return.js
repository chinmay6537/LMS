const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/return-book", (req, res) => {

  if (!req.session.admin) {
    return res.redirect("/login");
  }

  const sql = `
    SELECT
      issued_books.id,
      students.name AS student_name,
      books.title AS book_title,
      issued_books.issue_date,
      issued_books.due_date,
      issued_books.return_date

    FROM issued_books

    JOIN students
    ON issued_books.student_id = students.id

    JOIN books
    ON issued_books.book_id = books.id

    WHERE issued_books.return_date IS NULL
  `;

  db.query(sql, (err, results) => {

    if (err) throw err;

    res.render("return-book", {
      issuedBooks: results
    });

  });

});

router.get("/return-book/:id", (req, res) => {

  const issueId = req.params.id;

  const getBookSql = `
    SELECT book_id, due_date
    FROM issued_books
    WHERE id = ?
  `;

  db.query(getBookSql, [issueId], (err, results) => {

    if (err) throw err;

    const bookId = results[0].book_id;
    const dueDate = new Date(results[0].due_date);

    const today = new Date();

    let fine = 0;

    if (today > dueDate) {

      const diffTime = today - dueDate;

      const diffDays = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      );

      fine = diffDays * 2;
    }

    const returnSql = `
      UPDATE issued_books
      SET return_date = CURDATE()
      WHERE id = ?
    `;

    db.query(returnSql, [issueId], (err) => {

      if (err) throw err;

      const updateBookSql = `
        UPDATE books
        SET available = available + 1
        WHERE id = ?
      `;
      db.query(updateBookSql, [bookId], (err) => {

        if (err) throw err;

        if (fine > 0) {

          const fineSql = `
      INSERT INTO fines
      (issue_id, amount)
      VALUES (?, ?)
    `;

          db.query(
            fineSql,
            [issueId, fine],
            (err) => {

              if (err) throw err;

              req.flash(
                "success",
                `Book Returned Successfully. Fine: ₹${fine}`
              );

              res.redirect("/fines");

            }
          );

        } else {

          req.flash(
            "success",
            `Book Returned Successfully. Fine: ₹${fine}`
          );

          res.redirect("/fines");

        }

      });

    });

  });

});

module.exports = router;
