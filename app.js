function showTab(id) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function addHabit() {
  const name = prompt("Введите название привычки:");
  if (!name) return;

  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  const newHabit = {
    name,
    progress: []
  };
  habits.push(newHabit);
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

function renderHabits() {
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  const list = document.getElementById("habitList");
  list.innerHTML = '';

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${habit.name}
      <button onclick="markHabit(${index})">✔</button>
    `;
    list.appendChild(li);
  });
}

function markHabit(index) {
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  const today = new Date().toISOString().split('T')[0];

  if (!habits[index].progress.includes(today)) {
    habits[index].progress.push(today);
  }

  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

renderHabits();
showTab('habits');
