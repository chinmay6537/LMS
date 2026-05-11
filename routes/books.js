const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/books", (req, res) => {

  if (!req.session.admin) {
    return res.redirect("/login");
  }

  let sql = "SELECT * FROM books";

  if (req.query.search) {

    sql = `
      SELECT * FROM books
      WHERE
        title LIKE '%${req.query.search}%'
        OR author LIKE '%${req.query.search}%'
        OR category LIKE '%${req.query.search}%'
    `;
  }

  db.query(sql, (err, results) => {

    if (err) throw err;

    res.render("books", {
      books: results
    });

  });

});

router.post("/books/add", (req, res) => {

  const {
    title,
    author,
    category,
    quantity
  } = req.body;

  const sql = `
    INSERT INTO books
    (title, author, category, quantity, available)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      author,
      category,
      quantity,
      quantity
    ],
    (err) => {

      if (err) throw err;

      req.flash(
        "success",
        "Book Added Successfully"
      );

      res.redirect("/books");

    }
  );

});

router.get("/books/delete/:id", (req, res) => {

  const bookId = req.params.id;

  const checkSql = `
    SELECT *
    FROM issued_books
    WHERE book_id = ?
    AND return_date IS NULL
  `;

  db.query(checkSql, [bookId], (err, results) => {

    if (err) throw err;

    if (results.length > 0) {

      return res.send(
        "Cannot delete book because it is currently issued"
      );

    }

    const deleteSql =
      "DELETE FROM books WHERE id = ?";

    db.query(deleteSql, [bookId], (err) => {

      if (err) throw err;

      req.flash(
        "success",
        "Book Deleted Successfully"
      );

      res.redirect("/books");

    });

  });

});

router.get("/books/edit/:id", (req, res) => {

  const sql =
    "SELECT * FROM books WHERE id = ?";

  db.query(sql, [req.params.id], (err, results) => {

    if (err) throw err;

    res.render("edit-book", {
      book: results[0]
    });

  });

});

router.post("/books/update/:id", (req, res) => {

  const {
    title,
    author,
    category,
    quantity
  } = req.body;

  const sql = `
    UPDATE books
    SET
      title = ?,
      author = ?,
      category = ?,
      quantity = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      author,
      category,
      quantity,
      req.params.id
    ],
    (err) => {

      if (err) throw err;

      req.flash(
        "success",
        "Book Updated Successfully"
      );

      res.redirect("/books");

    }
  );

});

module.exports = router;