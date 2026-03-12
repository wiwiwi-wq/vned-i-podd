class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.loadFromStorage();
    }

    createTask(title, description, priority) {
        const id = Date.now().toString();
        const task = new Task(id, title, description, priority);
        this.tasks.push(task);
        this.saveToStorage();
        return task;
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }

    getAllTasks() {
        return this.tasks;
    }

    getFilteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks;
        }
        return this.tasks.filter(task => task.status === this.currentFilter);
    }

    updateTask(id, title, description, priority) {
        const task = this.getTask(id);
        if (task) {
            task.update(title, description, priority);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    changeTaskStatus(id) {
        const task = this.getTask(id);
        if (task) {
            const nextStatus = task.getNextStatus();
            task.changeStatus(nextStatus);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    setFilter(filter) {
        this.currentFilter = filter;
    }

    saveToStorage() {
        try {
            const tasksData = this.tasks.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                createdAt: task.createdAt
            }));
            localStorage.setItem('tasks', JSON.stringify(tasksData));
        } catch (error) {
            console.error('Ошибка сохранения в LocalStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const tasksData = localStorage.getItem('tasks');
            if (tasksData) {
                const parsedTasks = JSON.parse(tasksData);
                this.tasks = parsedTasks.map(data => 
                    new Task(data.id, data.title, data.description, data.priority, data.status)
                );
            }
        } catch (error) {
            console.error('Ошибка загрузки из LocalStorage:', error);
            this.tasks = [];
        }
    }

    getStatistics() {
        return {
            total: this.tasks.length,
            new: this.tasks.filter(t => t.status === 'new').length,
            inProgress: this.tasks.filter(t => t.status === 'in-progress').length,
            completed: this.tasks.filter(t => t.status === 'completed').length
        };
    }
}
