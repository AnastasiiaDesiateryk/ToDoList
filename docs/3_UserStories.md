# User Stories — To-Do Application (MVP v1)


## Contents
- [Story 1 — Add a new task](#story-1--add-a-new-task)
- [Story 2 — View task list](#story-2--view-task-list)
- [Story 3 — Mark task as completed](#story-3--mark-task-as-completed)
- [Story 4 — Edit a task](#story-4--edit-a-task)
- [Story 5 — Delete a task](#story-5--delete-a-task)
- [Story 6 — Prioritize tasks](#story-6--prioritize-tasks)
- [Story 7 — Set due date](#story-7--set-due-date)
- [Story 8 — Categorize tasks](#story-8--categorize-tasks)
- [Story 9 — Search tasks](#story-9--search-tasks)
- [Story 10 — Persist data](#story-10--persist-data)

---

### Story 1 — Add a new task
**As a** user  
**I want** to add 
a new task with a title and optional description  
**So that** I can capture things I need to do

**Acceptance Criteria**
- User can enter a task **title (mandatory)** and **description (optional)**.
- On save, the task is **added to the task list**.
- **Empty titles are not allowed** (validation prevents save).
<img width="931" height="398" alt="Screenshot 2025-10-07 at 09 48 21" src="https://github.com/user-attachments/assets/e590dd7f-d750-40bf-beb1-4ab354233fb7" />

---

### Story 2 — View task list
**As a** user  
**I want** to see a list of all my tasks  
**So that** I have an overview of what I need to do

**Acceptance Criteria**
- All existing tasks are displayed in a **scrollable list**.
- Each task shows at least the **title**.
- The list **refreshes automatically** after adding/removing tasks.
<img width="562" height="411" alt="Screenshot 2025-10-07 at 09 50 24" src="https://github.com/user-attachments/assets/c02ca808-546b-450b-8359-e6cec70a9bbc" />

---

### Story 3 — Mark task as completed
**As a** user  
**I want** to mark a task as completed  
**So that** I can visually separate finished work from pending tasks

**Acceptance Criteria**
- Each task has a **checkbox/toggle** for completion.
- Completed tasks are displayed as **crossed-out** or otherwise **visually distinct**.
- Completion state **persists after app reload**.
<img width="580" height="400" alt="Screenshot 2025-10-07 at 09 54 30" src="https://github.com/user-attachments/assets/643a8da9-3ed0-44c9-9be7-70bc9324e9b4" />

---

### Story 4 — Edit a task
**As a** user  
**I want** to edit an existing task  
**So that** I can correct mistakes or update details

**Acceptance Criteria**
- User can update both **title** and **description**.
- Changes are **saved immediately** (on save/confirm).
- Validation rules apply (**title required**, no empty save).
<img width="514" height="406" alt="Screenshot 2025-10-07 at 09 53 07" src="https://github.com/user-attachments/assets/8eee5e6c-1dfb-4085-848c-aeeb83191305" />

---

### Story 5 — Delete a task
**As a** user  
**I want** to delete a task  
**So that** I can remove irrelevant or completed items

**Acceptance Criteria**
- Each task has a **delete action**.
- App **confirms before final deletion** (e.g., confirmation dialog).
- Deleted tasks **no longer appear** in the task list.
<img width="731" height="354" alt="Screenshot 2025-10-07 at 09 56 03" src="https://github.com/user-attachments/assets/3994aa2f-f864-43f3-a1fd-c77a1420ebcc" />

---

### Story 6 — Prioritize tasks
**As a** user  
**I want** to set a priority (e.g., High/Medium/Low) for each task  
**So that** I can focus on the most important work

**Acceptance Criteria**
- Priority can be chosen from a **predefined set**: High / Medium / Low.
- Tasks show their **priority visually** (e.g., a label/icon).
- Tasks can be **sorted or filtered by priority**.
<img width="932" height="332" alt="Screenshot 2025-10-07 at 09 58 08" src="https://github.com/user-attachments/assets/160a4156-12af-427f-8cf7-0fde29e3035d" />

---

### Story 7 — Set due date
**As a** user  
**I want** to assign a due date to tasks  
**So that** I know when something must be finished

**Acceptance Criteria**
- User can select a **due date** from a date picker.
- Tasks with due dates display them in the **list view**.
- **Overdue tasks** are **highlighted**.
<img width="791" height="483" alt="Screenshot 2025-10-07 at 10 01 18" src="https://github.com/user-attachments/assets/19069e54-aaf1-4595-bb2a-83ec0d527d13" />

---

### Story 8 — Categorize tasks
**As a** user  
**I want** to assign tasks to categories (e.g., Work, Personal)  
**So that** I can organize my responsibilities

**Acceptance Criteria**
- User can assign **one category per task**.
- App provides **default categories** (Work, Personal).
- User can **filter** task list by category.
<img width="936" height="410" alt="Screenshot 2025-10-07 at 10 02 06" src="https://github.com/user-attachments/assets/c2ea3838-baeb-4a50-b8c6-b1ea1c897893" />

---

### Story 9 — Search tasks
**As a** user  
**I want** to search tasks by title or description  
**So that** I can quickly find a specific item

**Acceptance Criteria**
- **Search field** is available above the task list.
- Search results **update dynamically** as the user types.
- Only **matching tasks** are displayed.
<img width="780" height="486" alt="Screenshot 2025-10-07 at 10 03 01" src="https://github.com/user-attachments/assets/b4d79c96-1937-47b3-aae2-f304499d6aab" />

---

### Story 10 — Persist data
**As a** user  
**I want** my tasks to be saved persistently  
**So that** they are available even after restarting the app

**Acceptance Criteria**
- All task fields (**title, description, state, priority, due date, category**) are stored in a **persistent store**.
- Data is **automatically loaded** on app startup.
- **No data loss** occurs between sessions.

---
© 2025 Anastasiia Desiateryk
