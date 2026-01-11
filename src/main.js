import "./style.css";

/* -------------------- GRADE POINT MAP -------------------- */
const gradePoints = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "P": 4,
  "I": 4
};

/* -------------------- THEORY GP (Annexure-IV) -------------------- */
function getTheoryGP(wgp) {
  if (wgp > 9) return 10;       // O
  if (wgp > 8) return 9;       // A+
  if (wgp > 7) return 8;       // A
  if (wgp > 6) return 7;       // B+
  if (wgp > 5) return 6;       // B
  if (wgp > 4) return 5;       // C
  return 4;                   // P
}

/* -------------------- LAB GP (Annexure-VI) -------------------- */
function getLabGP(marks) {
  if (marks >= 90) return 10;  // O
  if (marks >= 80) return 9;   // A+
  if (marks >= 70) return 8;   // A
  if (marks >= 60) return 7;   // B+
  if (marks >= 50) return 6;   // B
  if (marks >= 41) return 5;   // C
  if (marks >= 33) return 4;   // P
  return 0;                   // F
}

/* -------------------- UI -------------------- */
document.getElementById("app").innerHTML = `
<div class="max-w-6xl mx-auto p-6">
  <div class="bg-white p-6 rounded-xl shadow-xl">
    <h1 class="text-3xl font-bold text-center text-indigo-700 mb-4">
      GITAM SGPA Calculator
    </h1>
    <p class="text-center text-gray-600 mb-6">
      Based on Evaluation Policy 2025–26
    </p>

    <table class="w-full border mb-4" id="table">
      <tr class="bg-indigo-100">
        <th>Subject</th>
        <th>Credits</th>
        <th>S1</th>
        <th>LE</th>
        <th>S2</th>
        <th>Has Lab?</th>
        <th>Lab Marks</th>
        <th></th>
      </tr>
    </table>

    <div class="flex gap-3">
      <button id="add" class="bg-indigo-600 text-white px-4 py-2 rounded">
        ➕ Add Subject
      </button>

      <button id="calc" class="bg-green-600 text-white px-4 py-2 rounded">
        📊 Calculate SGPA
      </button>
    </div>

    <div id="result" class="mt-6 text-3xl font-bold text-center text-indigo-700"></div>
  </div>
</div>
`;

const table = document.getElementById("table");

/* -------------------- ADD SUBJECT ROW -------------------- */
function addRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="border p-1 w-full"/></td>
    <td><input type="number" class="border p-1 w-full credits"/></td>
    <td><input class="border p-1 w-full s1"/></td>
    <td><input class="border p-1 w-full le"/></td>
    <td><input class="border p-1 w-full s2"/></td>
    <td class="text-center">
      <input type="checkbox" class="labToggle"/>
    </td>
    <td>
      <input type="number" class="border p-1 w-full lab hidden" placeholder="0–100"/>
    </td>
    <td><button class="text-red-600 remove">❌</button></td>
  `;

  tr.querySelector(".labToggle").addEventListener("change", e => {
    tr.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
  });

  tr.querySelector(".remove").onclick = () => tr.remove();
  table.appendChild(tr);
}

document.getElementById("add").onclick = addRow;
addRow();

/* -------------------- CALCULATE SGPA -------------------- */
document.getElementById("calc").onclick = () => {
  let totalPoints = 0;
  let totalCredits = 0;

  document.querySelectorAll("#table tr").forEach((row, i) => {
    if (i === 0) return;

    const credits = +row.querySelector(".credits").value;
    const s1 = gradePoints[row.querySelector(".s1").value.toUpperCase()];
    const le = gradePoints[row.querySelector(".le").value.toUpperCase()];
    const s2 = gradePoints[row.querySelector(".s2").value.toUpperCase()];
    const hasLab = row.querySelector(".labToggle").checked;

    // ---- THEORY WGP ----
    const wgp = (s1 * 0.30) + (le * 0.25) + (s2 * 0.45);
    const theoryGP = getTheoryGP(wgp);

    let finalGP = theoryGP;

    // ---- TP COURSE ----
    if (hasLab) {
      const labMarks = +row.querySelector(".lab").value;
      const labGP = getLabGP(labMarks);
      finalGP = (theoryGP * 0.70) + (labGP * 0.30);
    }

    totalPoints += finalGP * credits;
    totalCredits += credits;
  });

  const sgpa = (totalPoints / totalCredits).toFixed(2);
  document.getElementById("result").innerText = `🎯 SGPA = ${sgpa}`;
};

