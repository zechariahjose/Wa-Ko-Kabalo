document.addEventListener("DOMContentLoaded", () => {
    const plannerWeek = document.getElementById("plannerWeek");
    const sessionModal = document.getElementById("sessionModal");
    const sessionForm = document.getElementById("sessionForm");
    const newSessionButton = document.getElementById("newSessionButton");
    const closeSessionModal = document.getElementById("closeSessionModal");
    const cancelSessionModal = document.getElementById("cancelSessionModal");
    const sessionModalTitle = document.getElementById("sessionModalTitle");
    const deleteSessionButton = document.getElementById("deleteSessionButton");
    const plannerDays = document.getElementById("plannerDays");
    const plannerDateRange = document.getElementById("plannerDateRange");
    const plannerFlowTitle = document.getElementById("plannerFlowTitle");
    const plannerFlowSummary = document.getElementById("plannerFlowSummary");
    const plannerViewTabs = document.querySelectorAll(".planner-view-tabs button");

    if (!plannerWeek || !sessionForm) {
        return;
    }

    plannerViewTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            plannerViewTabs.forEach(item => item.classList.remove("active"));
            tab.classList.add("active");
        });
    });

    let selectedDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    let weekOffset = 0;

    function formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function getWeekDates() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monday = new Date(today);
        const day = monday.getDay();
        monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1) + weekOffset * 7);
        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + index);
            return date;
        });
    }

    function isTaskDone(item) {
        return item.status === "completed" || item.completed === true;
    }

    function getDayItems(date) {
        const dateKey = formatDateKey(date);
        const tasks = getTasks().filter(task => task.deadline === dateKey).map(task => ({ ...task, itemType: "task" }));
        const sessions = getStudySessions().filter(session => session.date === dateKey).map(session => ({ ...session, itemType: "session" }));
        return [...tasks, ...sessions].sort((a, b) => (a.startTime || "99:99").localeCompare(b.startTime || "99:99"));
    }

    function getDotClass(item) {
        if (item.itemType === "session") return "dot-blue";
        return `dot-${item.priority || "medium"}`;
    }

    function renderDateStrip(weekDates) {
        if (!plannerDays) return;
        const todayKey = formatDateKey(new Date());
        plannerDays.innerHTML = weekDates.map(date => {
            const dateKey = formatDateKey(date);
            const dayItems = getDayItems(date);
            const dotTypes = [...new Set(dayItems.map(getDotClass))];
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
            return `<button class="planner-day ${dateKey === formatDateKey(selectedDate) ? "active" : ""}" type="button" data-date="${dateKey}" aria-pressed="${dateKey === formatDateKey(selectedDate)}">
                <span>${dayName}${dateKey === todayKey ? " <b>Today</b>" : ""}</span><strong>${date.getDate()}</strong><small class="planner-dots">${dotTypes.map(type => `<i class="${type}"></i>`).join("")}</small>
            </button>`;
        }).join("");
        if (plannerDateRange) {
            plannerDateRange.textContent = `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
        }
    }

    function populateSubjectOptions() {
        const subjectSelect = document.getElementById("sessionSubject");

        if (!subjectSelect) {
            return;
        }

        const subjects = getSubjects();

        if (!subjects.length) {
            subjectSelect.innerHTML = '<option value="">No subjects available</option>';
            return;
        }

        subjectSelect.innerHTML = subjects.map(subject => {
            return `<option value="${subject.id}">${subject.name}</option>`;
        }).join("");
    }

    function renderPlanner() {
        const weekDates = getWeekDates();
        if (!weekDates.some(date => formatDateKey(date) === formatDateKey(selectedDate))) {
            selectedDate = weekDates[0];
        }
        renderDateStrip(weekDates);
        const sessions = getStudySessions().sort((a, b) => {
            const aDate = new Date(`${a.date}T${a.startTime || "00:00"}:00`);
            const bDate = new Date(`${b.date}T${b.startTime || "00:00"}:00`);
            return aDate - bDate;
        });

        const selectedItems = getDayItems(selectedDate);
        const selectedDay = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
        plannerWeek.innerHTML = `
                <div class="planner-day-column">
                    <div class="planner-day-heading"><h3>${selectedDay}, ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</h3><span>${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"}</span></div>
                    <div class="session-list">
                        ${selectedItems.length ? selectedItems.map(item => {
                            const subject = getSubjectById(item.subjectId);
                            const done = isTaskDone(item);
                            const itemTime = item.itemType === "task" ? `Due ${item.deadline}` : `${item.startTime} · ${item.duration} min`;
                            return `
                                <div class="session-item planner-session-item ${done ? "is-complete" : ""}">
                                    <button class="completion-toggle ${done ? "is-complete" : ""}" type="button" data-action="toggle-complete" data-type="${item.itemType}" data-id="${item.id}" aria-label="${done ? "Mark incomplete" : "Mark complete"}">${done ? "✓" : ""}</button>
                                    <div class="planner-session-time">${itemTime}</div>
                                    <h4>${item.itemType === "task" ? item.title : item.topic}</h4>
                                    <div class="session-meta">
                                        <span>${subject ? subject.name : "Unknown"}</span>
                                    </div>
                                    <div class="form-actions planner-session-actions">
                                        <div class="form-actions-right">
                                            ${item.itemType === "session" ? `<button class="secondary-btn small-btn" type="button" data-action="edit" data-id="${item.id}">Edit</button><button class="danger-btn small-btn" type="button" data-action="delete" data-id="${item.id}">Delete</button>` : ""}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join("") : '<p class="empty-state">No tasks or study blocks planned for this day.</p>'}
                    </div>
                </div>
            `;
        if (plannerFlowTitle) plannerFlowTitle.firstChild.textContent = `${selectedDay}'s Focus Flow `;
        if (plannerFlowSummary) plannerFlowSummary.textContent = `${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"}`;
    }

    function toggleComplete(type, id) {
        if (type === "task") {
            const tasks = getTasks();
            const task = tasks.find(item => String(item.id) === String(id));
            if (task) {
                task.status = isTaskDone(task) ? "in-progress" : "completed";
                task.completed = task.status === "completed";
                saveTasks(tasks);
            }
        } else {
            const sessions = getStudySessions();
            const session = sessions.find(item => String(item.id) === String(id));
            if (session) {
                session.completed = !isTaskDone(session);
                saveStudySessions(sessions);
            }
        }
        renderPlanner();
    }

    function openSessionModal(session = null) {
        populateSubjectOptions();

        if (!session) {
            sessionForm.reset();
            document.getElementById("sessionId").value = "";
            document.getElementById("sessionDuration").value = "60";
            sessionModalTitle.textContent = "Add session";
            deleteSessionButton.hidden = true;
            if (sessionModal) sessionModal.hidden = false;
            return;
        }

        document.getElementById("sessionId").value = session.id;
        document.getElementById("sessionTopic").value = session.topic || "";
        document.getElementById("sessionSubject").value = session.subjectId;
        document.getElementById("sessionDate").value = session.date || "";
        document.getElementById("sessionStartTime").value = session.startTime || "";
        document.getElementById("sessionDuration").value = session.duration || 60;
        sessionModalTitle.textContent = "Edit session";
        deleteSessionButton.hidden = false;
        if (sessionModal) sessionModal.hidden = false;
    }

    function closeSessionModalWindow() {
        if (sessionModal) {
            sessionModal.hidden = true;
        }
        sessionForm.reset();
        document.getElementById("sessionId").value = "";
    }

    function saveSession(event) {
        event.preventDefault();

        const formData = new FormData(sessionForm);
        const topic = (formData.get("topic") || "").toString().trim();
        const date = (formData.get("date") || "").toString();
        const startTime = (formData.get("startTime") || "").toString();
        const duration = Number(formData.get("duration") || 0);
        const subjectId = Number(formData.get("subjectId") || 0);

        if (!topic || !date || !startTime || !duration) {
            alert("Please complete the session details.");
            return;
        }

        const sessions = getStudySessions();
        const sessionId = document.getElementById("sessionId").value;
        const payload = {
            topic,
            subjectId: Number.isFinite(subjectId) ? subjectId : 1,
            date,
            startTime,
            duration: Math.max(15, duration)
        };

        if (sessionId) {
            const index = sessions.findIndex(session => String(session.id) === String(sessionId));

            if (index >= 0) {
                sessions[index] = { ...sessions[index], ...payload };
            }
        } else {
            const nextId = sessions.length ? Math.max(...sessions.map(session => Number(session.id || 0))) + 1 : 1;
            sessions.push({ id: nextId, ...payload });
        }

        saveStudySessions(sessions);
        closeSessionModalWindow();
        renderPlanner();
    }

    function deleteSession(sessionId) {
        const sessions = getStudySessions().filter(session => String(session.id) !== String(sessionId));
        saveStudySessions(sessions);
        closeSessionModalWindow();
        renderPlanner();
    }

    newSessionButton?.addEventListener("click", () => openSessionModal());
    closeSessionModal?.addEventListener("click", closeSessionModalWindow);
    cancelSessionModal?.addEventListener("click", closeSessionModalWindow);

    sessionModal?.addEventListener("click", (event) => {
        if (event.target === sessionModal) {
            closeSessionModalWindow();
        }
    });

    sessionForm.addEventListener("submit", saveSession);

    deleteSessionButton?.addEventListener("click", () => {
        const sessionId = document.getElementById("sessionId").value;
        if (sessionId) {
            deleteSession(sessionId);
        }
    });

    plannerWeek.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const sessionId = button.dataset.id;
        const action = button.dataset.action;

        if (action === "toggle-complete") {
            toggleComplete(button.dataset.type, sessionId);
            return;
        }

        if (action === "edit") {
            const session = getStudySessions().find(item => String(item.id) === String(sessionId));
            if (session) {
                openSessionModal(session);
            }
        }

        if (action === "delete") {
            deleteSession(sessionId);
        }
    });

    plannerDays?.addEventListener("click", (event) => {
        const dayButton = event.target.closest("button[data-date]");
        if (!dayButton) return;
        selectedDate = new Date(`${dayButton.dataset.date}T00:00:00`);
        renderPlanner();
    });

    document.querySelector(".planner-date-control button:first-child")?.addEventListener("click", () => {
        weekOffset -= 1;
        renderPlanner();
    });

    document.querySelector(".planner-date-control button:last-child")?.addEventListener("click", () => {
        weekOffset += 1;
        renderPlanner();
    });

    populateSubjectOptions();
    renderPlanner();
});
