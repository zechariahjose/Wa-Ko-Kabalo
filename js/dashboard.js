document.addEventListener("DOMContentLoaded", () => {

    loadStatistics();
    loadPriorityTasks();
    loadUpcomingTasks();

});


function loadStatistics() {

    const tasks = getTasks();

    const today = new Date()
        .toISOString()
        .split("T")[0];


    const activeTasks = tasks.filter(
        task => task.status !== "completed"
    );


    const dueToday = tasks.filter(
        task =>
            task.deadline === today &&
            task.status !== "completed"
    );


    const overdue = tasks.filter(
        task =>
            task.deadline < today &&
            task.status !== "completed"
    );


    const completed = tasks.filter(
        task => task.status === "completed"
    );


    document.getElementById("activeTasks").textContent =
        activeTasks.length;

    document.getElementById("dueToday").textContent =
        dueToday.length;

    document.getElementById("overdueTasks").textContent =
        overdue.length;

    document.getElementById("completedTasks").textContent =
        completed.length;
}


function loadPriorityTasks() {

    const tasks = getTasks();

    const container =
        document.getElementById("priorityTasks");


    const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    };


    const priorityTasks = tasks
        .filter(task => task.status !== "completed")
        .sort(
            (a, b) =>
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
        )
        .slice(0, 5);


    container.innerHTML = "";


    if (priorityTasks.length === 0) {

        container.innerHTML =
            "<p>Wala kay pending tasks. Nice! 🎉</p>";

        return;
    }


    priorityTasks.forEach(task => {

        const subject = getSubjectById(task.subjectId);


        const element = document.createElement("div");

        element.innerHTML = `
            <h4>${task.title}</h4>

            <p>
                Subject:
                ${subject ? subject.name : "Unknown"}
            </p>

            <p>
                Deadline:
                ${task.deadline}
            </p>

            <p>
                Priority:
                ${task.priority}
            </p>

            <p>
                Progress:
                ${task.progress}%
            </p>

            <hr>
        `;


        container.appendChild(element);

    });
}


function loadUpcomingTasks() {

    const tasks = getTasks();

    const today =
        new Date().toISOString().split("T")[0];


    const upcomingTasks = tasks
        .filter(
            task =>
                task.deadline >= today &&
                task.status !== "completed"
        )
        .sort(
            (a, b) =>
                new Date(a.deadline) -
                new Date(b.deadline)
        )
        .slice(0, 5);


    const container =
        document.getElementById("upcomingTasks");


    container.innerHTML = "";


    if (upcomingTasks.length === 0) {

        container.innerHTML =
            "<p>No upcoming deadlines.</p>";

        return;
    }


    upcomingTasks.forEach(task => {

        const element =
            document.createElement("p");

        element.textContent =
            `${task.deadline} — ${task.title}`;

        container.appendChild(element);

    });
}
