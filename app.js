// ==== Основной интерфейс ====
function showTab(id) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(id).style.display = 'block';
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

    card.onclick = (e) => {
      if (!e.target.classList.contains("habit-day")) {
        openCalendar(index);
      }
    };

    const title = document.createElement("h3");
    title.textContent = habit.name;

    const desc = document.createElement("p");
    desc.textContent = habit.unit ? `Цель: ${habit.amount} ${habit.unit}` : '';

    const week = document.createElement("div");
    week.className = "habit-week";

    days.forEach(date => {
      const day = document.createElement("div");
      day.className = "habit-day";
      if (habit.progress.includes(date)) {
        day.classList.add("checked");
      }

      day.onclick = (e) => {
        e.stopPropagation();
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

function openCalendar(index) {
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

// ==== Модальные окна ====
function openHabitModal() {
  newHabitData = {};
  document.getElementById("habitModal").style.display = "flex";
}

function closeHabitModal() {
  document.getElementById("habitModal").style.display = "none";
}

function closeAllModals() {
  document.getElementById("habitModal").style.display = "none";
  document.getElementById("habitStep2").style.display = "none";
  document.getElementById("habitStep3").style.display = "none";
}

// ==== Создание привычки ====
let newHabitData = {};

function goToStep2() {
  const name = document.getElementById("habitName").value.trim();
  const color = document.getElementById("habitColor").value;
  const timesPerDay = parseInt(document.getElementById("habitTimesPerDay").value);
  const duration = parseInt(document.getElementById("habitDuration").value);

  if (!name || !color || !timesPerDay || !duration) {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  newHabitData = {
    name,
    color,
    timesPerDay,
    duration,
    amount: null,
    unit: null,
    reminderTime: null,
    daysOfWeek: [],
    progress: []
  };

  document.getElementById("habitModal").style.display = "none";
  document.getElementById("habitStep2").style.display = "flex";
}

function goToStep3() {
  const amount = parseInt(document.getElementById("habitAmount").value);
  const unit = document.getElementById("habitUnit").value;

  if (!amount || !unit) {
    alert("Пожалуйста, заполните количество и выберите единицу, либо нажмите 'Пропустить'.");
    return;
  }

  newHabitData.amount = amount;
  newHabitData.unit = unit;

  document.getElementById("habitStep2").style.display = "none";
  document.getElementById("habitStep3").style.display = "flex";
}

function skipToStep3() {
  newHabitData.amount = null;
  newHabitData.unit = null;

  document.getElementById("habitStep2").style.display = "none";
  document.getElementById("habitStep3").style.display = "flex";
}

function selectAllDays() {
  const checkboxes = document.querySelectorAll('#weekDaysCheckboxes input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
}

function saveHabit() {
  const reminderTime = document.getElementById("reminderTime").value;
  const dayCheckboxes = document.querySelectorAll('#weekDaysCheckboxes input[type="checkbox"]:checked');
  const daysOfWeek = Array.from(dayCheckboxes).map(cb => cb.value);

  newHabitData.reminderTime = reminderTime || null;
  newHabitData.daysOfWeek = daysOfWeek;

  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  habits.push(newHabitData);
  localStorage.setItem("habits", JSON.stringify(habits));

  closeAllModals();
  renderHabits();
}

// ==== Старт ====
renderHabits();
showTab('habits');
