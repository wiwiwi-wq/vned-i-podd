class UI {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.modal = document.getElementById('taskModal');
        this.taskForm = document.getElementById('taskForm');
        this.taskList = document.getElementById('taskList');
        this.editingTaskId = null;
        
        this.initializeElements();
    }

    initializeElements() {
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.closeBtn = document.querySelector('.close');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.modalTitle = document.getElementById('modalTitle');
        this.taskTitleInput = document.getElementById('taskTitle');
        this.taskDescriptionInput = document.getElementById('taskDescription');
        this.taskPriorityInput = document.getElementById('taskPriority');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    showAddTaskModal() {
        this.editingTaskId = null;
        this.modalTitle.textContent = 'Новая задача';
        this.taskForm.reset();
        this.modal.style.display = 'block';
    }

    showEditTaskModal(taskId) {
        const task = this.taskManager.getTask(taskId);
        if (!task) return;

        this.editingTaskId = taskId;
        this.modalTitle.textContent = 'Редактировать задачу';
        this.taskTitleInput.value = task.title;
        this.taskDescriptionInput.value = task.description;
        this.taskPriorityInput.value = task.priority;
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.taskForm.reset();
        this.editingTaskId = null;
    }

    renderTasks() {
        const tasks = this.taskManager.getFilteredTasks();
        this.taskList.innerHTML = '';

        if (tasks.length === 0) {
            this.taskList.innerHTML = `
                <div class="empty-state">
                    <h3>📭 Нет задач</h3>
                    <p>Создайте первую задачу, чтобы начать работу</p>
                </div>
            `;
            return;
        }

        tasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            this.taskList.appendChild(taskCard);
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <div class="task-header">
                <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                <span class="task-priority priority-${task.priority}">
                    ${task.getPriorityText()}
                </span>
            </div>
            <div class="task-status status-${task.status}">
                ${task.getStatusText()}
            </div>
            <p class="task-description">${this.escapeHtml(task.description) || 'Без описания'}</p>
            <div class="task-actions">
                <button class="btn-status" data-id="${task.id}">
                    ${task.getStatusButtonText()}
                </button>
                <button class="btn-edit" data-id="${task.id}">
                    ✏️ Изменить
                </button>
                <button class="btn-delete" data-id="${task.id}">
                    🗑️ Удалить
                </button>
            </div>
        `;

        const statusBtn = card.querySelector('.btn-status');
        const editBtn = card.querySelector('.btn-edit');
        const deleteBtn = card.querySelector('.btn-delete');

        statusBtn.addEventListener('click', () => this.handleStatusChange(task.id));
        editBtn.addEventListener('click', () => this.showEditTaskModal(task.id));
        deleteBtn.addEventListener('click', () => this.handleDelete(task.id));

        return card;
    }

    handleStatusChange(taskId) {
        this.taskManager.changeTaskStatus(taskId);
        this.renderTasks();
    }

    handleDelete(taskId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            this.taskManager.deleteTask(taskId);
            this.renderTasks();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const title = this.taskTitleInput.value.trim();
        const description = this.taskDescriptionInput.value.trim();
        const priority = this.taskPriorityInput.value;

        if (!title) {
            alert('Пожалуйста, введите название задачи');
            return;
        }

        if (this.editingTaskId) {
            this.taskManager.updateTask(this.editingTaskId, title, description, priority);
        } else {
            this.taskManager.createTask(title, description, priority);
        }

        this.closeModal();
        this.renderTasks();
    }

    handleFilter(filter) {
        this.taskManager.setFilter(filter);
        
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.renderTasks();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    initializeEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.showAddTaskModal());

        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        this.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleFilter(btn.dataset.filter);
            });
        });
    }
}
