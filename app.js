// --- ТАЙМЕР ---
let timer;
let remainingSeconds = 0;

const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startTimer");
const resetBtn = document.getElementById("resetTimer");

startBtn.addEventListener("click", () => {
  const min = parseInt(minutesInput.value) || 0;
  const sec = parseInt(secondsInput.value) || 0;
  remainingSeconds = min * 60 + sec;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
});

resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  remainingSeconds = 0;
  timerDisplay.textContent = "00:00";
});

function updateTimer() {
  if (remainingSeconds <= 0) {
    clearInterval(timer);
    timerDisplay.textContent = "Готово!";
    return;
  }
  remainingSeconds--;
  const min = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const sec = String(remainingSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = ${min}:${sec};
}

// --- ТРЕНИРОВКИ ---
const workoutList = document.getElementById("workoutList");
const workoutInput = document.getElementById("workoutInput");
const addWorkoutBtn = document.getElementById("addWorkout");

addWorkoutBtn.addEventListener("click", () => {
  const text = workoutInput.value.trim();
  if (text) {
    addListItem(workoutList, text, "workouts");
    workoutInput.value = "";
  }
});

loadList(workoutList, "workouts");

// --- ЦЕЛИ ---
const goalList = document.getElementById("goalList");
const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoal");

addGoalBtn.addEventListener("click", () => {
  const text = goalInput.value.trim();
  if (text) {
    addListItem(goalList, text, "goals");
    goalInput.value = "";
  }
});

loadList(goalList, "goals");

// --- Общие функции для списков ---
function addListItem(list, text, storageKey) {
  const li = document.createElement("li");
  li.textContent = text;

  const delBtn = document.createElement("button");
  delBtn.textContent = "✕";
  delBtn.onclick = () => {
    list.removeChild(li);
    saveList(list, storageKey);
  };

  li.onclick = () => {
    li.classList.toggle("checked");
    saveList(list, storageKey);
  };

  li.appendChild(delBtn);
  list.appendChild(li);
  saveList(list, storageKey);
}

function saveList(list, key) {
  const items = [];
  list.querySelectorAll("li").forEach(li => {
    items.push({ text: li.firstChild.textContent, checked: li.classList.contains("checked") });
  });
  localStorage.setItem(key, JSON.stringify(items));
}

function loadList(list, key) {
  const data = localStorage.getItem(key);
  if (!data) return;
  JSON.parse(data).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.text;
    if (item.checked) li.classList.add("checked");

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.onclick = () => {
      list.removeChild(li);
      saveList(list, key);
    };

    li.onclick = () => {
      li.classList.toggle("checked");
      saveList(list, key);
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}