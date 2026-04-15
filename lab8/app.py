from pathlib import Path
import sqlite3

from flask import Flask, redirect, render_template, request, url_for

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "lab8.db"

app = Flask(__name__, static_folder="public", template_folder="public")


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                course TEXT NOT NULL
            )
            """
        )


def create_student(name, age, course):
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO students (name, age, course) VALUES (?, ?, ?)",
            (name, age, course),
        )
        return cursor.lastrowid


def read_students():
    with get_connection() as connection:
        cursor = connection.execute("SELECT id, name, age, course FROM students ORDER BY id")
        return [dict(row) for row in cursor.fetchall()]


def read_student(student_id):
    with get_connection() as connection:
        cursor = connection.execute(
            "SELECT id, name, age, course FROM students WHERE id = ?",
            (student_id,),
        )
        row = cursor.fetchone()
        return dict(row) if row else None


def update_student(student_id, name, age, course):
    with get_connection() as connection:
        cursor = connection.execute(
            """
            UPDATE students
            SET name = ?, age = ?, course = ?
            WHERE id = ?
            """,
            (name, age, course, student_id),
        )
        return cursor.rowcount


def delete_student(student_id):
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM students WHERE id = ?", (student_id,))
        return cursor.rowcount


initialize_database()


def validate_inputs(name, age_raw, course):
    cleaned_name = name.strip()
    cleaned_course = course.strip()

    try:
        age = int(age_raw)
    except (TypeError, ValueError):
        return None, None, None, "Age must be a valid number."

    if not cleaned_name or not cleaned_course or age < 1:
        return None, None, None, "Name, age, and course are required."

    return cleaned_name, age, cleaned_course, None


def render_home(error=None, form_values=None, edit_student=None, status_code=200):
    students = read_students()
    values = form_values or {
        "name": "",
        "age": "",
        "course": "",
    }
    mode = "Update" if edit_student else "Create"
    action = (
        url_for("update_student_page", student_id=edit_student["id"])
        if edit_student
        else url_for("add_student")
    )

    return (
        render_template(
            "index.html",
            students=students,
            total_count=len(students),
            mode=mode,
            action=action,
            error=error,
            form_values=values,
            edit_student=edit_student,
        ),
        status_code,
    )


@app.get("/")
def home():
    return render_home()


@app.post("/students")
def add_student():
    name, age, course, error = validate_inputs(
        request.form.get("name", ""),
        request.form.get("age", ""),
        request.form.get("course", ""),
    )

    if error:
        return render_home(
            error=error,
            form_values={
                "name": request.form.get("name", ""),
                "age": request.form.get("age", ""),
                "course": request.form.get("course", ""),
            },
            status_code=400,
        )

    create_student(name, age, course)
    return redirect(url_for("home"))


@app.get("/students/<int:student_id>/edit")
def edit_student_page(student_id):
    student = read_student(student_id)
    if not student:
        return redirect(url_for("home"))

    return render_home(
        form_values={
            "name": student["name"],
            "age": student["age"],
            "course": student["course"],
        },
        edit_student=student,
    )


@app.post("/students/<int:student_id>")
def update_student_page(student_id):
    existing = read_student(student_id)
    if not existing:
        return redirect(url_for("home"))

    name, age, course, error = validate_inputs(
        request.form.get("name", ""),
        request.form.get("age", ""),
        request.form.get("course", ""),
    )

    if error:
        return render_home(
            error=error,
            form_values={
                "name": request.form.get("name", ""),
                "age": request.form.get("age", ""),
                "course": request.form.get("course", ""),
            },
            edit_student={"id": student_id},
            status_code=400,
        )

    update_student(student_id, name, age, course)
    return redirect(url_for("home"))


@app.post("/students/<int:student_id>/delete")
def remove_student(student_id):
    delete_student(student_id)
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)
