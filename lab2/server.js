const express = require("express");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let pending = [];
let completed = [];

app.get("/tasks", (req, res) => {
    res.json({ pending, completed });
});

app.post("/add", (req, res) => {
    pending.push(req.body.task);
    res.redirect("/");
});

app.get("/done/:id", (req, res) => {
    completed.push(pending[req.params.id]);
    pending.splice(req.params.id, 1);
    res.redirect("/");
});

app.get("/delete-pending/:id", (req, res) => {
    pending.splice(req.params.id, 1);
    res.redirect("/");
});

app.get("/delete-completed/:id", (req, res) => {
    completed.splice(req.params.id, 1);
    res.redirect("/");
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
