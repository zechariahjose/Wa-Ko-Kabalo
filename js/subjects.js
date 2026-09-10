document.addEventListener("DOMContentLoaded", () => {
    const subjectsGrid = document.getElementById("subjectsGrid");

    if (!subjectsGrid) {
        return;
    }

    const subjects = getSubjects();

    if (!subjects.length) {
        subjectsGrid.innerHTML = '<div class="empty-state">No subjects yet.</div>';
        return;
    }

    subjectsGrid.innerHTML = subjects.map(subject => {
        const relatedTasks = getTasks().filter(task => task.subjectId === subject.id);
        const completedCount = relatedTasks.filter(task => task.status === "completed").length;
        const progress = relatedTasks.length ? Math.round((completedCount / relatedTasks.length) * 100) : 0;

        return `
            <article class="subject-card">
                <div class="subject-card-header">
                    <h3>${subject.name}</h3>
                    <span class="subject-code">${subject.code}</span>
                </div>
                <p>${subject.instructor}</p>
                <div class="subject-meta">
                    <span>${relatedTasks.length} tasks</span>
                    <span>${completedCount} completed</span>
                </div>
                <div class="progress-line">
                    <span style="width: ${progress}%"></span>
                </div>
            </article>
        `;
    }).join("");
});
