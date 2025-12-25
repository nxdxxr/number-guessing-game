// filepath: script.js
// ตัวแปรเก็บตัวเลขลับ
let secretNumber = 0;
// ตัวแปรนับจํานวนครั้งที่ทาย
let attemptCount = 0;
// ตัวแปรเก็บค่าสูงสุดตามระดับความยาก
let maxNumber = 100;

// ฟังก์ชันเปลี่ยนระดับความยาก
function changeDifficulty() {
  const select = document.getElementById("difficultySelect");
  maxNumber = parseInt(select.value);
  document.getElementById(
    "rangeText"
  ).textContent = `ทายตัวเลขตั้งแต่ 1 ถึง ${maxNumber}`;
  resetGame();
}

// ฟังก์ชันเริ่มเกมใหม่
function initializeGame() {
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  attemptCount = 0;
  updateDisplay();
}
// ฟังก์ชันตรวจสอบการทาย
function checkGuess() {
  const guessInput = document.getElementById("guessInput");
  const guessValue = parseInt(guessInput.value);
  const resultContainer = document.getElementById("resultContainer");
  // ... validation code ...
  attemptCount++; // เพิ่มตรงนี้
  if (guessValue === secretNumber) {
    resultContainer.innerHTML = `
 <div class="alert alert-success" role="alert">
 <h5>✓ ถูกต้อง!</h5>
 <p>คุณทายถูกในครั้งที่ ${attemptCount}</p>
 </div>
 `;
  }

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
    resultContainer.innerHTML = `
 <div class="alert alert-success" role="alert">
 <h5>✓ ถูกต้อง!</h5>
 <p>คุณทายถูกในครั้งที่ ${attemptCount}</p>
 </div>
 `;
  } else if (guessValue > secretNumber) {
    resultContainer.innerHTML = `
 <div class="alert alert-warning" role="alert">
 ↓ ตัวเลขสูงไป
 </div>
 `;
  } else {
    resultContainer.innerHTML = `
 <div class="alert alert-info" role="alert">
 ↑ ตัวเลขตํ่าไป
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
  attemptsContainer.textContent = `ทายแล้ว: ${attemptCount} ครั้ง`;
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
