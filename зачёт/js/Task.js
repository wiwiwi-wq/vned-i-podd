class Task {
    constructor(id, title, description, priority, status = 'new') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority; // low, medium, high
        this.status = status; // new, in-progress, completed
        this.createdAt = new Date().toISOString();
    }

    changeStatus(newStatus) {
        const validStatuses = ['new', 'in-progress', 'completed'];
        if (validStatuses.includes(newStatus)) {
            this.status = newStatus;
            return true;
        }
        return false;
    }

    update(title, description, priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    getNextStatus() {
        const statusFlow = {
            'new': 'in-progress',
            'in-progress': 'completed',
            'completed': 'new'
        };
        return statusFlow[this.status];
    }

    getStatusButtonText() {
        const statusText = {
            'new': 'Начать',
            'in-progress': 'Завершить',
            'completed': 'Возобновить'
        };
        return statusText[this.status];
    }

    getStatusText() {
        const statusNames = {
            'new': 'Новая',
            'in-progress': 'В работе',
            'completed': 'Завершена'
        };
        return statusNames[this.status];
    }

    getPriorityText() {
        const priorityNames = {
            'low': 'Низкий',
            'medium': 'Средний',
            'high': 'Высокий'
        };
        return priorityNames[this.priority];
    }
}
