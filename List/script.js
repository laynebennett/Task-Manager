document.addEventListener("DOMContentLoaded", () => {
    // Storage functions
    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll('#task-list .task')).map(task => {
            const isTimeBased = task.classList.contains('progress-container');
            return {
                name: task.querySelector('label, span').textContent,
                completed: task.querySelector('input')?.checked || false,
                progress: isTimeBased ? parseInt(task.querySelector('.progress').style.width) || 0 : null,
                total: isTimeBased ? parseInt(task.querySelector('button[data-total]').dataset.total) : null
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task.name, task.total, task.progress, task.completed);
        });
    }

    function addTaskToDOM(name, total = null, progress = 0, completed = false) {
        const taskElement = document.createElement('div');
        taskElement.className = total ? 'task progress-container' : 'task';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', saveTasks);

        if (total) {
            const taskLabel = document.createElement('span');
            taskLabel.textContent = name;
            taskElement.appendChild(checkbox);
            taskElement.appendChild(taskLabel);

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progressDiv = document.createElement('div');
            progressDiv.className = 'progress';
            progressDiv.style.width = progress + '%';
            progressBar.appendChild(progressDiv);
            taskElement.appendChild(progressBar);

            const incrementButton = document.createElement('button');
            incrementButton.className = 'increment-btn';
            incrementButton.textContent = '+5 min';
            incrementButton.dataset.total = total;
            incrementButton.addEventListener('click', () => {
                let currentWidth = parseInt(progressDiv.style.width) || 0;
                currentWidth += (5 / total) * 100;
                if (currentWidth >= 100) {
                    currentWidth = 100;
                    checkbox.checked = true;
                }
                progressDiv.style.width = currentWidth + '%';
                saveTasks();
            });
            taskElement.appendChild(incrementButton);
        } else {
            const label = document.createElement('label');
            label.textContent = name;
            taskElement.appendChild(checkbox);
            taskElement.appendChild(label);
        }

        const clearButton = document.createElement('button');
        clearButton.className = 'clear-task';
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', () => {
            taskElement.remove();
            saveTasks();
        });
        taskElement.appendChild(clearButton);

        document.getElementById('task-list').appendChild(taskElement);
        saveTasks();
    }

    // Add Task functionality
    document.getElementById('add-task').addEventListener('click', () => {
        const name = document.getElementById('task-name').value;
        const total = parseInt(document.getElementById('task-total').value);

        if (name) {
            addTaskToDOM(name, total || null);
            document.getElementById('task-name').value = '';
            document.getElementById('task-total').value = '';
        }
    });

    // Clear All functionality
    document.getElementById('clear-all-btn').addEventListener('click', () => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ''; // Remove all task elements
        localStorage.removeItem('tasks'); // Clear tasks from local storage
    });

    document.getElementById('task-name').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('add-task').click();  // Trigger the click event of the Add Task button
        }
    });

    document.getElementById('task-total').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('add-task').click();  // Trigger the click event of the Add Task button
        }
    });

    // Load tasks on page load
    window.onload = loadTasks;
});
