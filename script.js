// filepath: script.js
// ตัวแปรเก็บตัวเลขลับ
let ans = Math.floor(Math.random() * 100) + 1;
// ฟังก์ชันตรวจสอบการทาย
function checkGuess() {
  let g = parseInt(document.getElementById("txt").value);
  let result = document.getElementById("result");
  if (g === ans) {
    result.textContent = "✓ ถูกต้อง!";
  } else if (g > ans) {
    result.textContent = "↓ ตัวเลขสูงไป";
  } else {
    result.textContent = "↑ ตัวเลขตํ่าไป";
  }
}
