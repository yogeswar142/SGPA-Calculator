import "./style.css";
import { inject } from "@vercel/analytics";

inject();

const gradePoints = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "I": 4
};

function getTheoryGP(wgp) {
  if (wgp > 9) return 10;
  if (wgp > 8) return 9;
  if (wgp > 7) return 8;
  if (wgp > 6) return 7;
  if (wgp > 5) return 6;
  if (wgp > 4) return 5;
  return 4;
}

function getLabGP(marks) {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 41) return 5;
  if (marks >= 33) return 4;
  return 0;
}

const grades = ["O","A+","A","B+","B","C","P","I"];

document.getElementById("app").innerHTML = `
<div class="max-w-6xl mx-auto p-6">
  <div class="bg-white p-6 rounded-xl shadow-xl">
    <h1 class="text-3xl font-bold text-center text-indigo-700 mb-4">GITAM SGPA Calculator</h1>

    <table class="w-full border mb-4" id="table">
      <tr class="bg-indigo-100">
        <th>Subject</th>
        <th>Credits</th>
        <th>S1</th>
        <th>LE</th>
        <th>S2</th>
        <th>Lab?</th>
        <th>Lab Marks</th>
        <th></th>
      </tr>
    </table>

    <div class="flex gap-3">
      <button id="add" class="bg-indigo-600 text-white px-4 py-2 rounded">➕ Add Subject</button>
      <button id="calc" class="bg-green-600 text-white px-4 py-2 rounded">📊 Calculate SGPA</button>
    </div>

    <div id="error" class="mt-4 text-red-600 font-semibold"></div>
    <div id="result" class="mt-6 text-3xl font-bold text-center text-indigo-700"></div>
  </div>
</div>
`;

const table = document.getElementById("table");

function gradeSelect(cls) {
  return `<select class="border p-1 w-full ${cls}">
    <option value="">--</option>
    ${grades.map(g=>`<option value="${g}">${g}</option>`).join("")}
  </select>`;
}

function addRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="border p-1 w-full"/></td>
    <td><input type="number" min="1" class="border p-1 w-full credits"/></td>
    <td>${gradeSelect("s1")}</td>
    <td>${gradeSelect("le")}</td>
    <td>${gradeSelect("s2")}</td>
    <td class="text-center"><input type="checkbox" class="labToggle"/></td>
    <td><input type="number" min="0" max="100" class="border p-1 w-full lab hidden"/></td>
    <td><button class="text-red-600 remove">❌</button></td>
  `;

  tr.querySelector(".labToggle").onchange = e => {
    tr.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
  };

  tr.querySelector(".remove").onclick = () => tr.remove();
  table.appendChild(tr);
}

document.getElementById("add").onclick = addRow;
addRow();

document.getElementById("calc").onclick = () => {
  let total = 0, totalCredits = 0;
  let error = "";

  document.querySelectorAll("#table tr").forEach((row, i) => {
    if (i === 0) return;

    const credits = +row.querySelector(".credits").value;
    const s1 = row.querySelector(".s1").value;
    const le = row.querySelector(".le").value;
    const s2 = row.querySelector(".s2").value;
    const hasLab = row.querySelector(".labToggle").checked;
    const labInput = row.querySelector(".lab");

    if (!credits || !s1 || !le || !s2) {
      error = "Please fill all fields correctly.";
      return;
    }

    if (hasLab) {
      const m = labInput.value;
      if (m === "" || m < 0 || m > 100 || !Number.isInteger(Number(m))) {
        error = "Lab marks must be an integer between 0 and 100.";
        return;
      }
    }

    const wgp = (gradePoints[s1]*0.30)+(gradePoints[le]*0.25)+(gradePoints[s2]*0.45);
    const theoryGP = getTheoryGP(wgp);

    let finalGP = theoryGP;
    if (hasLab) {
      finalGP = (theoryGP*0.70)+(getLabGP(+labInput.value)*0.30);
    }

    total += finalGP * credits;
    totalCredits += credits;
  });

  if (error) {
    document.getElementById("error").innerText = error;
    document.getElementById("result").innerText = "";
    return;
  }

  document.getElementById("error").innerText = "";
  document.getElementById("result").innerText = `🎯 SGPA = ${(total/totalCredits).toFixed(2)}`;
};


