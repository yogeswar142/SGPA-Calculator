import "./style.css";

/* ------------ GRADE MAP ------------ */
const gradePoints = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "I": 4
};

const grades = ["O","A+","A","B+","B","C","P","I"];

/* ------------ POLICY ------------ */
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

/* ------------ UI ------------ */
document.getElementById("app").innerHTML = `
<div class="max-w-6xl mx-auto p-4">
  <div class="bg-white p-4 rounded-xl shadow-xl">
    <h1 class="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-4">
      GITAM SGPA Calculator
    </h1>

    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-[900px] w-full border mb-4" id="table">
        <tr class="bg-indigo-100">
          <th>Subject</th><th>Credits</th><th>S1</th><th>LE</th><th>S2</th>
          <th>Lab?</th><th>Lab Marks</th><th></th>
        </tr>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div id="mobileCards" class="md:hidden space-y-4"></div>

    <div class="flex gap-3 mt-4">
      <button id="add" class="bg-indigo-600 text-white px-4 py-2 rounded w-full">
        ➕ Add Subject
      </button>
      <button id="calc" class="bg-green-600 text-white px-4 py-2 rounded w-full">
        📊 Calculate
      </button>
    </div>

    <div id="error" class="mt-4 text-red-600 font-semibold"></div>
    <div id="result" class="mt-6 text-2xl font-bold text-center text-indigo-700"></div>
  </div>

  <footer class="mt-6 text-center text-white opacity-90">
    <a href="https://instagram.com/yogeswar265" target="_blank" class="inline-flex items-center gap-2">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" class="w-5 h-5"/>
      <span>Made by @yogeswar265</span>
    </a>
  </footer>
</div>
`;

const table = document.getElementById("table");
const mobile = document.getElementById("mobileCards");

/* ------------ HELPERS ------------ */
function gradeSelect(cls) {
  return `<select class="border p-2 w-full ${cls}">
    <option value="">--</option>
    ${grades.map(g=>`<option value="${g}">${g}</option>`).join("")}
  </select>`;
}

function createRow() {
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
  return tr;
}

function createCard() {
  const div = document.createElement("div");
  div.className = "bg-indigo-50 p-4 rounded-lg shadow";
  div.innerHTML = `
    <input class="border p-2 w-full mb-2" placeholder="Subject"/>
    <input type="number" min="1" class="border p-2 w-full mb-2 credits" placeholder="Credits"/>
    ${gradeSelect("s1")}
    ${gradeSelect("le")}
    ${gradeSelect("s2")}
    <label class="flex items-center mt-2">
      <input type="checkbox" class="labToggle mr-2"/> Has Lab
    </label>
    <input type="number" min="0" max="100" class="border p-2 w-full mt-2 lab hidden" placeholder="Lab Marks"/>
    <button class="mt-3 text-red-600 w-full">Remove</button>
  `;
  return div;
}

/* ------------ ADD SUBJECT ------------ */
document.getElementById("add").onclick = () => {
  const row = createRow();
  const card = createCard();

  // sync remove
  row.querySelector(".remove").onclick = () => {
    row.remove();
    card.remove();
  };
  card.querySelector("button").onclick = () => {
    row.remove();
    card.remove();
  };

  // sync lab toggle
  row.querySelector(".labToggle").onchange = e => {
    row.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
    card.querySelector(".labToggle").checked = e.target.checked;
    card.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
  };
  card.querySelector(".labToggle").onchange = e => {
    card.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
    row.querySelector(".labToggle").checked = e.target.checked;
    row.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
  };

  table.appendChild(row);
  mobile.appendChild(card);
};

document.getElementById("add").click();

/* ------------ CALCULATE ------------ */
document.getElementById("calc").onclick = () => {
  let total = 0, totalCredits = 0;
  let error = "";

  document.querySelectorAll("#table tr").forEach((row,i)=>{
    if(i===0) return;

    const c = +row.querySelector(".credits").value;
    const s1 = row.querySelector(".s1").value;
    const le = row.querySelector(".le").value;
    const s2 = row.querySelector(".s2").value;
    const hasLab = row.querySelector(".labToggle").checked;
    const lab = row.querySelector(".lab");

    if(!c || !s1 || !le || !s2){ error="Fill all fields"; return;}

    if(hasLab){
      const m = +lab.value;
      if(m<0||m>100||!Number.isInteger(m)){ error="Invalid lab marks"; return;}
    }

    const wgp = (gradePoints[s1]*0.30)+(gradePoints[le]*0.25)+(gradePoints[s2]*0.45);
    const theoryGP = getTheoryGP(wgp);

    let finalGP = theoryGP;
    if(hasLab) finalGP = (theoryGP*0.70)+(getLabGP(+lab.value)*0.30);

    total += finalGP*c;
    totalCredits += c;
  });

  if(error){
    document.getElementById("error").innerText = error;
    document.getElementById("result").innerText = "";
    return;
  }

  document.getElementById("error").innerText="";
  document.getElementById("result").innerText = `🎯 SGPA = ${(total/totalCredits).toFixed(2)}`;
};

