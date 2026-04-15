from pathlib import Path
import sqlite3

DB_PATH = Path(__file__).with_name("lab8.db")


def get_connection():
    return sqlite3.connect(DB_PATH)


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
        return cursor.fetchall()


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


def print_students():
    students = read_students()
    if not students:
        print("No records found.")
        return

    print("\nID | Name | Age | Course")
    print("-" * 32)
    for student in students:
        print(f"{student[0]} | {student[1]} | {student[2]} | {student[3]}")


def main():
    initialize_database()

    while True:
        print("\nCRUD Menu")
        print("1. Create")
        print("2. Read")
        print("3. Update")
        print("4. Delete")
        print("5. Exit")

        choice = input("Enter your choice: ").strip()

        if choice == "1":
            name = input("Enter name: ").strip()
            age = int(input("Enter age: "))
            course = input("Enter course: ").strip()
            student_id = create_student(name, age, course)
            print(f"Student added with ID {student_id}.")

        elif choice == "2":
            print_students()

        elif choice == "3":
            student_id = int(input("Enter student ID to update: "))
            name = input("Enter new name: ").strip()
            age = int(input("Enter new age: "))
            course = input("Enter new course: ").strip()
            updated = update_student(student_id, name, age, course)
            print("Record updated." if updated else "No matching record found.")

        elif choice == "4":
            student_id = int(input("Enter student ID to delete: "))
            deleted = delete_student(student_id)
            print("Record deleted." if deleted else "No matching record found.")

        elif choice == "5":
            print("Exiting...")
            break

        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
