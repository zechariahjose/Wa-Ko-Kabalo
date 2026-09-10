document.addEventListener("DOMContentLoaded", () => {
    const plannerWeek = document.getElementById("plannerWeek");

    if (!plannerWeek) {
        return;
    }

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const sessions = getStudySessions();

    plannerWeek.innerHTML = days.map(day => {
        const daySessions = sessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate.toLocaleDateString("en-US", { weekday: "long" }) === day;
        });

        return `
            <div class="day-card">
                <h3>${day}</h3>
                <div class="session-list">
                    ${daySessions.length ? daySessions.map(session => {
                        const subject = getSubjectById(session.subjectId);
                        return `
                            <div class="session-item">
                                <h4>${session.topic}</h4>
                                <div class="session-meta">
                                    <span>${subject ? subject.name : "Unknown"}</span>
                                    <span>${session.startTime}</span>
                                    <span>${session.duration} min</span>
                                </div>
                            </div>
                        `;
                    }).join("") : '<p class="empty-state">No study sessions.</p>'}
                </div>
            </div>
        `;
    }).join("");
});
