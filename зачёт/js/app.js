document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    
    const ui = new UI(taskManager);
    
    ui.initializeEventListeners();
    
    ui.renderTasks();
    
    console.log('Управление задачами запущен успешно!');
    console.log('Статистика задач:', taskManager.getStatistics());
});
