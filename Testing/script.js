document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const searchInput = document.getElementById('search-input');
    const sortBySelect = document.getElementById('sort-by');

    const kanbanColumns = document.querySelectorAll('.kanban-column');
    const allTaskLists = document.querySelectorAll('.task-list');
    
    let timers = {};

    // --- Fungsi Penyimpanan Lokal ---
    function saveTasks() {
        const boards = {};
        kanbanColumns.forEach(column => {
            const tasksData = [];
            column.querySelectorAll('.task-item').forEach(li => {
                tasksData.push({
                    text: li.dataset.text,
                    dueDate: li.dataset.dueDate || '',
                    priority: li.dataset.priority,
                    timerSeconds: li.dataset.timerSeconds || 0
                });
            });
            boards[column.id] = tasksData;
        });
        localStorage.setItem('kanbanTasks', JSON.stringify(boards));
    }

    function loadTasks() {
        const boards = JSON.parse(localStorage.getItem('kanbanTasks'));
        if (boards) {
            for (const columnId in boards) {
                const column = document.getElementById(columnId);
                if (column) {
                    boards[columnId].forEach(taskData => {
                        addTask(taskData.text, columnId, taskData.priority, taskData.dueDate, taskData.timerSeconds, false);
                    });
                }
            }
        }
        updateTaskCount();
    }
    
    // --- Fungsi Timer ---
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer(li) {
        const taskId = li.dataset.taskId;
        if (timers[taskId]) return;
        let seconds = parseInt(li.dataset.timerSeconds) || 0;
        const timerSpan = li.querySelector('.timer');
        const startBtn = li.querySelector('.start-timer-btn');
        const pauseBtn = li.querySelector('.pause-timer-btn');

        if (startBtn) startBtn.style.display = 'none';
        if (pauseBtn) pauseBtn.style.display = 'inline-block';

        const intervalId = setInterval(() => {
            seconds++;
            li.dataset.timerSeconds = seconds;
            timerSpan.textContent = `Dikerjakan: ${formatTime(seconds)}`;
            saveTasks();
        }, 1000);
        timers[taskId] = intervalId;
    }

    function pauseTimer(li) {
        const taskId = li.dataset.taskId;
        clearInterval(timers[taskId]);
        delete timers[taskId];
        
        const startBtn = li.querySelector('.start-timer-btn');
        const pauseBtn = li.querySelector('.pause-timer-btn');
        if (startBtn) startBtn.style.display = 'inline-block';
        if (pauseBtn) pauseBtn.style.display = 'none';
    }

    function checkDueDate(li) {
        const dueDate = li.dataset.dueDate;
        if (!dueDate) return;
        const now = new Date();
        const dueDateTime = new Date(dueDate);
        if (now > dueDateTime) {
            li.classList.add('expired');
        } else {
            li.classList.remove('expired');
        }
    }

    // --- Fungsi Tambah Tugas Baru ---
    function addTask(text, columnId = 'board-todo', priority = 'rendah', dueDate = '', timerSeconds = 0, isNew = true) {
        const list = document.getElementById(columnId)?.querySelector('.task-list');
        if (!list) return;

        const li = document.createElement('li');
        const taskId = 'task-' + Date.now() + Math.random().toString(36).substr(2, 9);
        li.dataset.taskId = taskId;
        li.dataset.text = text;
        li.dataset.priority = priority;
        li.dataset.dueDate = dueDate;
        li.dataset.timerSeconds = timerSeconds;

        li.classList.add('task-item', `priority-${priority}`);
        li.setAttribute('draggable', true);

        const taskInfoContainer = document.createElement('div');
        taskInfoContainer.classList.add('task-info-container');

        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('task-text');
        taskTextSpan.textContent = text;
        
        const dueDateSpan = document.createElement('span');
        dueDateSpan.classList.add('due-date');
        if (dueDate) {
            const formattedDate = new Date(dueDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
            dueDateSpan.textContent = `Tenggat: ${formattedDate}`;
            checkDueDate(li);
        }

        const timerSpan = document.createElement('span');
        timerSpan.classList.add('timer');
        timerSpan.textContent = `Dikerjakan: ${formatTime(timerSeconds)}`;

        taskInfoContainer.appendChild(taskTextSpan);
        taskInfoContainer.appendChild(dueDateSpan);
        taskInfoContainer.appendChild(timerSpan);

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        const moveBtn = document.createElement('button');
        moveBtn.classList.add('move-btn');
        moveBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
        
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

        const startTimerBtn = document.createElement('button');
        startTimerBtn.classList.add('timer-btn', 'start-timer-btn');
        startTimerBtn.innerHTML = '<i class="fas fa-play"></i>';
        startTimerBtn.style.display = 'none';

        const pauseTimerBtn = document.createElement('button');
        pauseTimerBtn.classList.add('timer-btn', 'pause-timer-btn');
        pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i>';
        pauseTimerBtn.style.display = 'none';

        deleteBtn.addEventListener('click', () => {
            li.remove();
            pauseTimer(li);
            updateTaskCount();
            saveTasks();
        });

        editBtn.addEventListener('click', () => {
            editTask(li);
        });

        moveBtn.addEventListener('click', () => {
            const currentColumnId = li.closest('.kanban-column').id;
            if (currentColumnId === 'board-todo') {
                const doingList = document.getElementById('board-doing').querySelector('.task-list');
                doingList.appendChild(li);
                li.style.textDecoration = 'none';
                moveBtn.innerHTML = '<i class="fas fa-check"></i>';
                startTimerBtn.style.display = 'inline-block';
            } else if (currentColumnId === 'board-doing') {
                pauseTimer(li);
                const doneList = document.getElementById('board-done').querySelector('.task-list');
                doneList.appendChild(li);
                moveBtn.style.display = 'none';
                li.style.textDecoration = 'line-through';
                li.style.color = '#888';
                startTimerBtn.style.display = 'none';
                pauseTimerBtn.style.display = 'none';
            }
            updateTaskCount();
            saveTasks();
        });

        startTimerBtn.addEventListener('click', () => {
            startTimer(li);
            startTimerBtn.style.display = 'none';
            pauseTimerBtn.style.display = 'inline-block';
        });

        pauseTimerBtn.addEventListener('click', () => {
            pauseTimer(li);
            startTimerBtn.style.display = 'inline-block';
            pauseTimerBtn.style.display = 'none';
        });

        taskActions.appendChild(moveBtn);
        taskActions.appendChild(startTimerBtn);
        taskActions.appendChild(pauseTimerBtn);
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        
        li.appendChild(taskInfoContainer);
        li.appendChild(taskActions);

        list.appendChild(li);
        
        if (columnId === 'board-doing') {
            moveBtn.innerHTML = '<i class="fas fa-check"></i>';
            startTimerBtn.style.display = 'inline-block';
        } else if (columnId === 'board-done') {
            li.style.textDecoration = 'line-through';
            li.style.color = '#888';
            moveBtn.style.display = 'none';
        } else if (columnId === 'board-todo') {
            // Biarkan tombol move ditampilkan dengan ikon panah
            // Biarkan tombol timer disembunyikan
        }

        if (isNew) {
            saveTasks();
            updateTaskCount();
            sortTasks();
            filterTasks();
        }
    }

    // --- Fungsi Pengeditan Tugas ---
    function editTask(li) {
        const currentText = li.dataset.text;
        const currentPriority = li.dataset.priority;
        const currentDueDate = li.dataset.dueDate;
        const currentTimerSeconds = li.dataset.timerSeconds;
        const currentColumnId = li.closest('.kanban-column').id;

        const taskInfoContainer = li.querySelector('.task-info-container');
        taskInfoContainer.innerHTML = `
            <input type="text" class="task-text editing-input" value="${currentText}">
            <input type="datetime-local" class="editing-input edit-date-input" value="${currentDueDate}">
            <select class="editing-input edit-priority-input">
                <option value="rendah" ${currentPriority === 'rendah' ? 'selected' : ''}>Prioritas Rendah</option>
                <option value="sedang" ${currentPriority === 'sedang' ? 'selected' : ''}>Prioritas Sedang</option>
                <option value="tinggi" ${currentPriority === 'tinggi' ? 'selected' : ''}>Prioritas Tinggi</option>
            </select>
        `;
        
        const editBtn = li.querySelector('.edit-btn');
        editBtn.innerHTML = '<i class="fas fa-save"></i>';
        editBtn.onclick = () => saveTaskChanges(li, currentColumnId, currentTimerSeconds);
    }

    function saveTaskChanges(li, originalColumnId, originalTimerSeconds) {
        const taskInfoContainer = li.querySelector('.task-info-container');
        const newText = taskInfoContainer.querySelector('.editing-input[type="text"]').value.trim();
        const newPriority = taskInfoContainer.querySelector('.edit-priority-input').value;
        const newDueDate = taskInfoContainer.querySelector('.edit-date-input').value;

        if (newText === '') {
            alert("Tugas tidak boleh kosong!");
            return;
        }

        li.dataset.text = newText;
        li.dataset.priority = newPriority;
        li.dataset.dueDate = newDueDate;
        li.dataset.timerSeconds = originalTimerSeconds;

        li.className = `task-item priority-${newPriority}`;
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('task-text');
        taskTextSpan.textContent = newText;
        
        const dueDateSpan = document.createElement('span');
        dueDateSpan.classList.add('due-date');
        if (newDueDate) {
            const formattedDate = new Date(newDueDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
            dueDateSpan.textContent = `Tenggat: ${formattedDate}`;
            checkDueDate(li);
        } else {
            dueDateSpan.textContent = '';
        }
        
        const timerSpan = document.createElement('span');
        timerSpan.classList.add('timer');
        timerSpan.textContent = `Dikerjakan: ${formatTime(originalTimerSeconds)}`;

        taskInfoContainer.innerHTML = '';
        taskInfoContainer.appendChild(taskTextSpan);
        taskInfoContainer.appendChild(dueDateSpan);
        taskInfoContainer.appendChild(timerSpan);
        
        const editBtn = li.querySelector('.edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.onclick = () => editTask(li);

        saveTasks();
    }

    // --- Drag and Drop Logic ---
    let draggedItem = null;

    allTaskLists.forEach(list => {
        list.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-item')) {
                draggedItem = e.target;
                setTimeout(() => e.target.classList.add('is-dragging'), 0);
            }
        });

        list.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('is-dragging');
                draggedItem = null;
                updateTaskCount();
                saveTasks();
            }
        });
    });

    kanbanColumns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const taskList = column.querySelector('.task-list');
            
            if (afterElement == null) {
                taskList.appendChild(draggedItem);
            } else {
                taskList.insertBefore(draggedItem, afterElement);
            }
        });
    });

    function getDragAfterElement(column, y) {
        const taskList = column.querySelector('.task-list');
        const draggableElements = [...taskList.querySelectorAll('.task-item:not(.is-dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- Event Listener Form Submit ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;
        
        if (taskText !== '') {
            addTask(taskText, 'board-todo', priority, dueDate, 0, true);
            taskInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = 'rendah';
        }
    });

    // --- Filter and Sort Logic ---
    function filterTasks() {
        const searchText = searchInput.value.toLowerCase();
        const allTaskItems = document.querySelectorAll('.task-item');
        allTaskItems.forEach(li => {
            const taskText = li.dataset.text.toLowerCase();
            const dueDate = li.dataset.dueDate ? new Date(li.dataset.dueDate).toLocaleString('id-ID').toLowerCase() : '';
            const priority = li.dataset.priority.toLowerCase();
            
            if (taskText.includes(searchText) || dueDate.includes(searchText) || priority.includes(searchText)) {
                li.style.display = 'flex';
            } else {
                li.style.display = 'none';
            }
        });
    }

    function sortTasks() {
        const sortBy = sortBySelect.value;
        const priorityOrder = { 'tinggi': 1, 'sedang': 2, 'rendah': 3 };

        kanbanColumns.forEach(column => {
            const taskList = column.querySelector('.task-list');
            const tasks = Array.from(taskList.children);
            
            if (sortBy === 'priority') {
                tasks.sort((a, b) => {
                    const priorityA = priorityOrder[a.dataset.priority];
                    const priorityB = priorityOrder[b.dataset.priority];
                    return priorityA - priorityB;
                });
            } else if (sortBy === 'due-date') {
                tasks.sort((a, b) => {
                    const dateA = new Date(a.dataset.dueDate || 0);
                    const dateB = new Date(b.dataset.dueDate || 0);
                    return dateA - dateB;
                });
            }
            
            tasks.forEach(task => taskList.appendChild(task));
        });
    }

    searchInput.addEventListener('input', filterTasks);
    sortBySelect.addEventListener('change', sortTasks);

    // --- Initial Load and Interval Checks ---
    loadTasks();
    setInterval(() => {
        document.querySelectorAll('.task-item').forEach(li => checkDueDate(li));
    }, 60000);
});