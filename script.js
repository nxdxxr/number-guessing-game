// filepath: script.js
// ตัวแปรเก็บตัวเลขลับ
let secretNumber = 0;
// ตัวแปรนับจํานวนครั้งที่ทาย
let attemptCount = 0;
// ตัวแปรเก็บค่าสูงสุดตามระดับความยาก
let maxNumber = 100;
// ตัวแปรเก็บจำนวนครั้งสูงสุดที่ทายได้
let maxAttempts = 7;
// ตัวแปรบอกว่าเกมจบแล้วหรือยัง
let gameOver = false;

// การตั้งค่าสำหรับแต่ละระดับความยาก
const difficultySettings = {
  10: { maxAttempts: 5, stars3: 2, stars2: 3, stars1: 5, name: "ง่าย" },
  50: { maxAttempts: 8, stars3: 4, stars2: 6, stars1: 8, name: "ปานกลาง" },
  100: { maxAttempts: 10, stars3: 5, stars2: 7, stars1: 10, name: "ยาก" },
  1000: { maxAttempts: 15, stars3: 7, stars2: 10, stars1: 15, name: "ยากมาก" },
};

// ฟังก์ชันเปลี่ยนระดับความยาก
function changeDifficulty() {
  const select = document.getElementById("difficultySelect");
  maxNumber = parseInt(select.value);
  const settings = difficultySettings[maxNumber];
  maxAttempts = settings.maxAttempts;
  document.getElementById(
    "rangeText"
  ).textContent = `ทายตัวเลขตั้งแต่ 1 ถึง ${maxNumber}`;
  resetGame();
}

// ฟังก์ชันเริ่มเกมใหม่
function initializeGame() {
  const settings = difficultySettings[maxNumber];
  maxAttempts = settings.maxAttempts;
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  attemptCount = 0;
  gameOver = false;
  updateDisplay();
}

// ฟังก์ชันคำนวณดาว
function calculateStars(attempts) {
  const settings = difficultySettings[maxNumber];
  if (attempts <= settings.stars3)
    return { stars: 3, emoji: "⭐⭐⭐", text: "ยอดเยี่ยม!" };
  if (attempts <= settings.stars2)
    return { stars: 2, emoji: "⭐⭐", text: "เก่งมาก!" };
  if (attempts <= settings.stars1)
    return { stars: 1, emoji: "⭐", text: "ดีมาก!" };
  return { stars: 0, emoji: "", text: "พยายามต่อไป!" };
}

// ฟังก์ชันคำนวณคะแนน (max 100 คะแนน)
function calculateScore(attempts) {
  const settings = difficultySettings[maxNumber];
  // คะแนนเต็ม 100 ถ้าทายครั้งเดียวถูก หักคะแนนตามจำนวนครั้งที่ทาย
  const pointsPerAttempt = 100 / settings.maxAttempts;
  const score = Math.round(100 - (attempts - 1) * pointsPerAttempt);
  return Math.max(score, 10); // ขั้นต่ำ 10 คะแนน
}

// ฟังก์ชันสร้าง Hint
function getHint(guessValue) {
  const diff = Math.abs(guessValue - secretNumber);
  const settings = difficultySettings[maxNumber];

  let hintText = "";
  let hintClass = "";
  let arrow = "";

  if (guessValue > secretNumber) {
    arrow = "↓";
    hintClass = "alert-warning";
  } else {
    arrow = "↑";
    hintClass = "alert-info";
  }

  // Hint ตามระยะห่าง (ระดับยากจะได้ hint น้อยกว่า)
  if (maxNumber <= 50) {
    // ระดับง่าย-ปานกลาง: hint ละเอียด
    if (diff <= 2) {
      hintText = "ใกล้มาก! 🔥🔥🔥";
    } else if (diff <= 5) {
      hintText = "ใกล้แล้ว! 🔥🔥";
    } else if (diff <= 10) {
      hintText = "อุ่นขึ้นแล้ว 🔥";
    } else {
      hintText = guessValue > secretNumber ? "ตัวเลขสูงไป" : "ตัวเลขต่ำไป";
    }
  } else if (maxNumber <= 100) {
    // ระดับยาก: hint ปานกลาง
    if (diff <= 5) {
      hintText = "ใกล้มาก! 🔥🔥";
    } else if (diff <= 15) {
      hintText = "ใกล้แล้ว! 🔥";
    } else {
      hintText = guessValue > secretNumber ? "ตัวเลขสูงไป" : "ตัวเลขต่ำไป";
    }
  } else {
    // ระดับยากมาก: hint น้อย
    if (diff <= 10) {
      hintText = "ใกล้มาก! 🔥";
    } else if (diff <= 50) {
      hintText = "อุ่นขึ้นแล้ว";
    } else if (diff <= 200) {
      hintText = guessValue > secretNumber ? "สูงไปมาก" : "ต่ำไปมาก";
    } else {
      hintText = guessValue > secretNumber ? "สูงไปมากๆ" : "ต่ำไปมากๆ";
    }
  }

  return { text: `${arrow} ${hintText}`, class: hintClass };
}

// ฟังก์ชันตรวจสอบการทาย
function checkGuess() {
  if (gameOver) {
    return;
  }

  const guessInput = document.getElementById("guessInput");
  const guessValue = parseInt(guessInput.value);
  const resultContainer = document.getElementById("resultContainer");

  // Validation: ตรวจสอบว่าใส่ตัวเลขหรือไม่
  if (isNaN(guessValue) || guessInput.value === "") {
    resultContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        กรุณาใส่ตัวเลข!
      </div>
    `;
    return;
  }

  // Validation: ตรวจสอบว่าอยู่ในช่วงที่กำหนดหรือไม่
  if (guessValue < 1 || guessValue > maxNumber) {
    resultContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        กรุณาใส่ตัวเลขระหว่าง 1 ถึง ${maxNumber}!
      </div>
    `;
    return;
  }

  attemptCount++;

  if (guessValue === secretNumber) {
    // ทายถูก!
    gameOver = true;
    const starResult = calculateStars(attemptCount);
    const score = calculateScore(attemptCount);

    resultContainer.innerHTML = `
      <div class="alert alert-success" role="alert">
        <h4>🎉 ถูกต้อง!</h4>
        <p>ตัวเลขคือ <strong>${secretNumber}</strong></p>
        <p>คุณทายถูกในครั้งที่ <strong>${attemptCount}</strong></p>
        <p class="mb-1">${starResult.emoji}</p>
        <p class="mb-1"><strong>${starResult.text}</strong></p>
        <hr>
        <p class="mb-0">🏆 คะแนน: <strong>${score}</strong> แต้ม</p>
      </div>
    `;
  } else if (attemptCount >= maxAttempts) {
    // หมดโอกาสทาย
    gameOver = true;
    resultContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <h4>💔 เสียใจด้วย!</h4>
        <p>คุณทายครบ ${maxAttempts} ครั้งแล้ว</p>
        <p>ตัวเลขที่ถูกต้องคือ <strong>${secretNumber}</strong></p>
        <p class="mb-0">กดปุ่ม "เริ่มใหม่" เพื่อลองอีกครั้ง</p>
      </div>
    `;
  } else {
    // ยังทายไม่ถูก
    const hint = getHint(guessValue);
    const remaining = maxAttempts - attemptCount;

    resultContainer.innerHTML = `
      <div class="alert ${hint.class}" role="alert">
        <strong>${hint.text}</strong>
        <p class="mb-0 mt-2">เหลือโอกาสอีก ${remaining} ครั้ง</p>
      </div>
    `;
  }

  updateDisplay();
  guessInput.value = "";
  guessInput.focus();
}

// ฟังก์ชันอัปเดตจํานวนครั้ง
function updateDisplay() {
  const attemptsContainer = document.getElementById("attemptsContainer");
  const settings = difficultySettings[maxNumber];
  attemptsContainer.innerHTML = `
    <span>ทายแล้ว: <strong>${attemptCount}</strong> / ${maxAttempts} ครั้ง</span>
    <br>
    <small class="text-muted">ระดับ: ${settings.name}</small>
  `;
}

// ฟังก์ชันเริ่มเกมใหม่
function resetGame() {
  initializeGame();
  document.getElementById("resultContainer").innerHTML = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("guessInput").focus();
}

// เริ่มเกมเมื่อโหลดหน้า
window.addEventListener("load", initializeGame);

// เพิ่มการ select text เมื่อคลิก input
document.addEventListener("DOMContentLoaded", function () {
  const guessInput = document.getElementById("guessInput");
  guessInput.addEventListener("focus", function () {
    this.select();
  });
});

// เพิ่มการรองรับ Enter key
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("guessInput")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        checkGuess();
      }
    });
});
