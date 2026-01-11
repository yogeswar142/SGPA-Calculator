import "./style.css";

const gradePoints = {
  "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "P": 4, "I": 4
};

const grades = ["O","A+","A","B+","B","C","P","I"];

function getTheoryGP(wgp){
  if(wgp>9) return 10;
  if(wgp>8) return 9;
  if(wgp>7) return 8;
  if(wgp>6) return 7;
  if(wgp>5) return 6;
  if(wgp>4) return 5;
  return 4;
}

function getLabGP(m){
  if(m>=90) return 10;
  if(m>=80) return 9;
  if(m>=70) return 8;
  if(m>=60) return 7;
  if(m>=50) return 6;
  if(m>=41) return 5;
  if(m>=33) return 4;
  return 0;
}

function gradeSelect(cls){
  return `<select class="border p-2 w-full ${cls}">
    <option value="">Select</option>
    ${grades.map(g=>`<option value="${g}">${g}</option>`).join("")}
  </select>`;
}

document.getElementById("app").innerHTML = `
<div class="max-w-6xl mx-auto p-4">
  <div class="bg-white p-4 rounded-xl shadow-xl">
    <h1 class="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-4">
      GITAM SGPA Calculator
    </h1>

    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-[900px] w-full border mb-4" id="table">
        <tr class="bg-indigo-100">
          <th>Subject</th><th>Credits</th><th>S1</th><th>LE</th><th>S2</th><th>Lab?</th><th>Lab Marks</th><th></th>
        </tr>
      </table>
    </div>

    <div id="mobileCards" class="md:hidden space-y-4"></div>

    <div class="flex gap-3 mt-4">
      <button id="add" class="bg-indigo-600 text-white px-4 py-2 rounded w-full">➕ Add Subject</button>
      <button id="calc" class="bg-green-600 text-white px-4 py-2 rounded w-full">📊 Calculate</button>
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

function createRow(){
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

function createCard(){
  const d = document.createElement("div");
  d.className = "bg-indigo-50 p-4 rounded-lg shadow";
  d.innerHTML = `
    <input class="border p-2 w-full mb-2" placeholder="Subject"/>
    <input type="number" min="1" class="border p-2 w-full mb-2 credits" placeholder="Credits"/>

    <label class="block font-semibold">Sessional 1</label>
    ${gradeSelect("s1")}

    <label class="block mt-2 font-semibold">LE</label>
    ${gradeSelect("le")}

    <label class="block mt-2 font-semibold">Sessional 2</label>
    ${gradeSelect("s2")}

    <label class="flex items-center mt-2">
      <input type="checkbox" class="labToggle mr-2"/> Has Lab
    </label>

    <input type="number" min="0" max="100" class="border p-2 w-full mt-2 lab hidden" placeholder="Lab Marks"/>
    <button class="mt-3 text-red-600 w-full">Remove</button>
  `;
  return d;
}

document.getElementById("add").onclick = () => {
  const r = createRow();
  const c = createCard();

  r.querySelector(".remove").onclick = () => { r.remove(); c.remove(); };
  c.querySelector("button").onclick = () => { r.remove(); c.remove(); };

  r.querySelector(".labToggle").onchange = e=>{
    r.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
    c.querySelector(".labToggle").checked = e.target.checked;
    c.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
  };

  c.querySelector(".labToggle").onchange = e=>{
    c.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
    r.querySelector(".labToggle").checked = e.target.checked;
    r.querySelector(".lab").classList.toggle("hidden", !e.target.checked);
  };

  table.appendChild(r);
  mobile.appendChild(c);
};

document.getElementById("add").click();

document.getElementById("calc").onclick = () => {
  const isMobile = window.innerWidth < 768;
  const rows = isMobile ? mobile.children : table.querySelectorAll("tr:not(:first-child)");

  let total=0, totalCredits=0, error="";

  [...rows].forEach(row=>{
    const get = cls => row.querySelector(cls);
    const credits = +get(".credits")?.value;
    const s1 = get(".s1")?.value;
    const le = get(".le")?.value;
    const s2 = get(".s2")?.value;
    const hasLab = get(".labToggle")?.checked;
    const lab = get(".lab")?.value;

    if(!credits || !s1 || !le || !s2){ error="Fill all fields"; return; }
    if(hasLab && (!Number.isInteger(+lab) || lab<0 || lab>100)){ error="Invalid Lab Marks"; return; }

    const wgp = gradePoints[s1]*0.3 + gradePoints[le]*0.25 + gradePoints[s2]*0.45;
    let gp = getTheoryGP(wgp);
    if(hasLab) gp = gp*0.7 + getLabGP(+lab)*0.3;

    total += gp*credits;
    totalCredits += credits;
  });

  if(error){ 
    document.getElementById("error").innerText = error;
    document.getElementById("result").innerText="";
    return;
  }

  document.getElementById("error").innerText="";
  document.getElementById("result").innerText = "🎯 SGPA = " + (total/totalCredits).toFixed(2);
};


