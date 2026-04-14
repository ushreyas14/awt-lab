from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Welcome to Flask dynamic routing demo!"

@app.route("/user/<name>")
def show_user(name):
    return f"Hello, {name}!"

@app.route("/square/<int:number>")
def square(number):
    return f"Square of {number} is {number * number}"

@app.route("/docs/<path:subpath>")
def show_docs(subpath):
    return f"Requested docs path: {subpath}"

if __name__ == "__main__":
    app.run(debug=True)