const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const prioritySelect = document.getElementById('priority-select');
const todoList = document.getElementById('todo-list');
const remaining = document.getElementById('remaining');
const clearBtn = document.getElementById('clear-btn');
const tabs = document.querySelectorAll('.tab');
const closeBtn = document.getElementById('close-btn');

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentFilter = 'all';

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getFiltered() {
  if (currentFilter === 'active') return todos.filter(t => !t.done);
  if (currentFilter === 'done') return todos.filter(t => t.done);
  return todos;
}

function render() {
  todoList.innerHTML = '';
  const filtered = getFiltered();

  if (filtered.length === 0) {
    const msg = document.createElement('li');
    msg.className = 'empty-msg';
    msg.textContent =
      currentFilter === 'done' ? '완료된 항목이 없습니다.' :
      currentFilter === 'active' ? '진행 중인 항목이 없습니다.' :
      '할 일을 추가해보세요!';
    todoList.appendChild(msg);
  } else {
    const sorted = [...filtered].sort((a, b) =>
      PRIORITY_ORDER[a.priority ?? 'medium'] - PRIORITY_ORDER[b.priority ?? 'medium']
    );

    sorted.forEach((todo) => {
      const index = todos.indexOf(todo);
      const priority = todo.priority ?? 'medium';
      const li = document.createElement('li');
      li.className = `todo-item priority-border-${priority}` + (todo.done ? ' done' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.done;
      checkbox.addEventListener('change', () => toggle(index));

      const badge = document.createElement('span');
      badge.className = `priority-badge priority-${priority}`;
      badge.textContent = priority === 'high' ? '높음' : priority === 'low' ? '낮음' : '보통';

      const span = document.createElement('span');
      span.textContent = todo.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '✕';
      deleteBtn.addEventListener('click', () => remove(index));

      li.append(checkbox, badge, span, deleteBtn);
      todoList.appendChild(li);
    });
  }

  const count = todos.filter(t => !t.done).length;
  remaining.textContent = `남은 항목: ${count}개`;
}

function add() {
  const text = input.value.trim();
  if (!text) return;
  todos.push({ text, done: false, priority: prioritySelect.value });
  input.value = '';
  save();
  render();
}

function toggle(index) {
  todos[index].done = !todos[index].done;
  save();
  render();
}

function remove(index) {
  todos.splice(index, 1);
  save();
  render();
}

addBtn.addEventListener('click', add);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') add();
});
clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    render();
  });
});

let listVisible = true;

closeBtn.addEventListener('click', () => {
  listVisible = !listVisible;
  todoList.style.display = listVisible ? '' : 'none';
  document.querySelector('.footer').style.display = listVisible ? '' : 'none';
  closeBtn.textContent = listVisible ? '닫기' : '열기';
});

render();
