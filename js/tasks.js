document.addEventListener("DOMContentLoaded", () => {
    const taskTableBody = document.getElementById("taskTableBody");

    if (!taskTableBody) {
        return;
    }

    const tasks = getTasks();

    if (!tasks.length) {
        taskTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">No tasks have been added yet.</td>
            </tr>
        `;
        return;
    }

    taskTableBody.innerHTML = tasks.map(task => {
        const subject = getSubjectById(task.subjectId);
        const statusClass = task.status ? `status-${task.status.replace(/\s+/g, "-")}` : "status-not-started";

        return `
            <tr>
                <td>
                    <strong>${task.title}</strong><br>
                    <small>${task.description || "No description"}</small>
                </td>
                <td>${subject ? subject.name : "Unknown"}</td>
                <td>${task.deadline || "No deadline"}</td>
                <td><span class="priority-badge priority-${task.priority || "medium"}">${task.priority || "medium"}</span></td>
                <td><span class="status-badge ${statusClass}">${task.status || "not-started"}</span></td>
                <td>
                    ${task.progress || 0}%
                    <div class="progress-line"><span style="width: ${task.progress || 0}%"></span></div>
                </td>
            </tr>
        `;
    }).join("");
});
