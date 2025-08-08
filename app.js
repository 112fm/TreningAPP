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

  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7; // Приводим к 0=Пн, 6=Вс
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - currentDayIndex + i);
    return d.toISOString().split('T')[0];
  });

  habits.forEach((habit, index) => {
    const card = document.createElement("div");
    card.className = "habit-card";

    const title = document.createElement("h3");
    title.textContent = habit.name;

    const desc = document.createElement("p");
    desc.textContent = habit.description || "";

    const week = document.createElement("div");
    week.className = "habit-week";

    days.forEach(date => {
      const day = document.createElement("div");
      day.className = "habit-day";
      if (habit.progress?.includes(date)) {
        day.classList.add("checked");
      }

      day.onclick = () => {
        if (!habit.progress.includes(date)) {
          habit.progress.push(date);
        } else {
          habit.progress = habit.progress.filter(d => d !== date);
        }
        localStorage.setItem("habits", JSON.stringify(habits));
        renderHabits();
      };

      week.appendChild(day);
    });

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(week);
    list.appendChild(card);
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
