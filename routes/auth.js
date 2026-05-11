const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admins WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      req.session.admin = results[0];
      res.redirect("/dashboard");
    } else {
      res.send("Invalid Username or Password");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
