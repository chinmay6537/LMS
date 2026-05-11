const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/students", (req, res) => {

  if (!req.session.admin) {
    return res.redirect("/login");
  }

  let sql = "SELECT * FROM students";

  if (req.query.search) {

    sql = `
      SELECT * FROM students
      WHERE
        name LIKE '%${req.query.search}%'
        OR usn LIKE '%${req.query.search}%'
        OR department LIKE '%${req.query.search}%'
    `;
  }

  db.query(sql, (err, results) => {

    if (err) throw err;

    res.render("students", {
      students: results
    });

  });

});

router.post("/students/add", (req, res) => {

  const {
    name,
    usn,
    department,
    phone
  } = req.body;

  const sql = `
    INSERT INTO students
    (name, usn, department, phone)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      usn,
      department,
      phone
    ],
    (err) => {

      if (err) {

        if (err.code === "ER_DUP_ENTRY") {

          return res.send(
            "USN already exists"
          );

        }

        throw err;
      }

      req.flash(
        "success",
        "Student Added Successfully"
      );

      res.redirect("/students");

    }
  );

});

router.get("/students/delete/:id", (req, res) => {

  const studentId = req.params.id;

  const checkSql = `
    SELECT *
    FROM issued_books
    WHERE student_id = ?
  `;

  db.query(checkSql, [studentId], (err, results) => {

    if (err) throw err;

    if (results.length > 0) {

      return res.send(
        "Cannot delete student because they have library records"
      );

    }

    const deleteSql =
      "DELETE FROM students WHERE id = ?";

    db.query(deleteSql, [studentId], (err) => {

      if (err) throw err;

      req.flash(
        "success",
        "Student Deleted Successfully"
      );

      res.redirect("/students");

    });

  });

});

router.get("/students/edit/:id", (req, res) => {

  const sql =
    "SELECT * FROM students WHERE id = ?";

  db.query(sql, [req.params.id], (err, results) => {

    if (err) throw err;

    res.render("edit-student", {
      student: results[0]
    });

  });

});

router.post("/students/update/:id", (req, res) => {

  const {
    name,
    usn,
    department,
    phone
  } = req.body;

  const sql = `
    UPDATE students
    SET
      name = ?,
      usn = ?,
      department = ?,
      phone = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      usn,
      department,
      phone,
      req.params.id
    ],
    (err) => {

      if (err) throw err;

      req.flash(
        "success",
        "Student Updated Successfully"
      );

      res.redirect("/students");

    }
  );

});

module.exports = router;