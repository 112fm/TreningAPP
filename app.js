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

let currentHabitIndex = null;

function openCalendar(index) {
  currentHabitIndex = index;

  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  const habit = habits[index];

  const modal = document.getElementById("calendarModal");
  const grid = document.getElementById("calendarGrid");
  const title = document.getElementById("calendarTitle");

  title.textContent = `Прогресс: ${habit.name}`;
  grid.innerHTML = '';

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const iso = date.toISOString().split('T')[0];

    const div = document.createElement("div");
    div.className = "calendar-day";
    div.textContent = day;

    if (habit.progress.includes(iso)) {
      div.classList.add("checked");
    }

    grid.appendChild(div);
  }

  modal.style.display = "flex";
}

function closeCalendar() {
  document.getElementById("calendarModal").style.display = "none";
}

function renderHabits() {
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  const list = document.getElementById("habitList");
  list.innerHTML = '';

  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7;
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

    // Клик по всей неделе открывает календарь
    week.onclick = () => openCalendar(index);

    days.forEach(date => {
      const day = document.createElement("div");
      day.className = "habit-day";
      if (habit.progress.includes(date)) {
        day.classList.add("checked");
      }

      // Отмечаем/снимаем галку
      day.onclick = (e) => {
        e.stopPropagation(); // блокируем открытие календаря
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
