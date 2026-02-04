async function loadTasks() {
    const res = await fetch("/tasks");
    const data = await res.json();

    const pending = document.getElementById("pending");
    const completed = document.getElementById("completed");

    pending.innerHTML = "";
    completed.innerHTML = "";

    data.pending.forEach((task, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${task} 
        <span>
            <a href="/done/${i}">Check</a>
            <a href="/delete-pending/${i}">Delete</a>
        </span>`;
        pending.appendChild(li);
    });

    data.completed.forEach((task, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${task} 
        <a href="/delete-completed/${i}">Delete</a>`;
        completed.appendChild(li);
    });
}

loadTasks();
