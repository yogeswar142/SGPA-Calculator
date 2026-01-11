import "./style.css";

/* ---------- GRADE MAP ---------- */
const gradePoints = { "O":10,"A+":9,"A":8,"B+":7,"B":6,"C":5,"P":4,"I":4 };
const grades = ["O","A+","A","B+","B","C","P","I"];

/* ---------- POLICY ---------- */
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
const getCEGP = getLabGP; // same grading table

function gradeSelect(cls){
  return `<select class="border p-2 w-full ${cls}">
    <option value="">Select</option>
    ${grades.map(g=>`<option value="${g}">${g}</option>`).join("")}
  </select>`;
}

/* ---------- UI ---------- */
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
          <th>Subject</th><th>Credits</th><th>S1</th><th>LE</th><th>S2</th><th>Lab?</th><th>Lab Marks</th><th></th>
        </tr>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div id="mobileCards" class="md:hidden space-y-4"></div>

    <button id="add" class="bg-indigo-600 text-white px-4 py-2 rounded w-full mb-4">
      ➕ Add Subject
    </button>

    <!-- CLAD Section -->
    <div class="bg-indigo-50 p-4 rounded-lg shadow mb-4">
      <h2 class="font-bold text-indigo-700 mb-2">CLAD / Value Added Course (1 Credit)</h2>
      <label class="block text-sm font-semibold">Marks (0–100)</label>
      <input id="cladMarks" type="number" min="0" max="100" class="border p-2 w-full" placeholder="Enter CLAD marks"/>
    </div>

    <button id="calc" class="bg-green-600 text-white px-4 py-2 rounded w-full">
      📊 Calculate SGPA
    </button>

    <div id="error" class="mt-3 text-red-600"></div>
    <div id="result" class="mt-4 text-2xl font-bold text-center text-indigo-700"></div>
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

/* ---------- SUBJECT UI ---------- */
function createRow(){
  const tr=document.createElement("tr");
  tr.innerHTML=`
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
  const d=document.createElement("div");
  d.className="bg-indigo-50 p-4 rounded shadow";
  d.innerHTML=`
    <input class="border p-2 w-full mb-2" placeholder="Subject"/>
    <input type="number" min="1" class="border p-2 w-full mb-2 credits" placeholder="Credits"/>

    <label>Sessional 1</label>${gradeSelect("s1")}
    <label class="mt-2">LE</label>${gradeSelect("le")}
    <label class="mt-2">Sessional 2</label>${gradeSelect("s2")}

    <label class="flex items-center mt-2">
      <input type="checkbox" class="labToggle mr-2"/> Has Lab
    </label>

    <input type="number" min="0" max="100" class="border p-2 w-full mt-2 lab hidden" placeholder="Lab Marks"/>
    <button class="mt-3 text-red-600 w-full">Remove</button>
  `;
  return d;
}

/* ---------- ADD SUBJECT ---------- */
document.getElementById("add").onclick=()=>{
  const r=createRow(), c=createCard();
  table.appendChild(r); mobile.appendChild(c);

  r.querySelector(".remove").onclick=()=>{r.remove();c.remove();}
  c.querySelector("button").onclick=()=>{r.remove();c.remove();}

  r.querySelector(".labToggle").onchange=e=>{
    r.querySelector(".lab").classList.toggle("hidden",!e.target.checked);
    c.querySelector(".labToggle").checked=e.target.checked;
    c.querySelector(".lab").classList.toggle("hidden",!e.target.checked);
  };
  c.querySelector(".labToggle").onchange=e=>{
    c.querySelector(".lab").classList.toggle("hidden",!e.target.checked);
    r.querySelector(".labToggle").checked=e.target.checked;
    r.querySelector(".lab").classList.toggle("hidden",!e.target.checked);
  };
};
document.getElementById("add").click();

/* ---------- CALCULATE ---------- */
document.getElementById("calc").onclick=()=>{
  const rows = window.innerWidth<768 ? mobile.children : table.querySelectorAll("tr:not(:first-child)");
  let total=0, credits=0, error="";

  [...rows].forEach(r=>{
    const g=cls=>r.querySelector(cls)?.value;
    const c=+g(".credits");
    const s1=g(".s1"), le=g(".le"), s2=g(".s2");
    const hasLab=r.querySelector(".labToggle")?.checked;
    const lab=g(".lab");

    if(!c||!s1||!le||!s2){error="Fill all subject fields";return;}

    const wgp=gradePoints[s1]*.3+gradePoints[le]*.25+gradePoints[s2]*.45;
    let gp=getTheoryGP(wgp);

    if(hasLab){
      const m=+lab;
      if(m<0||m>100){error="Invalid Lab Marks";return;}
      gp=gp*.7+getLabGP(m)*.3;
    }

    total+=gp*c; credits+=c;
  });

  const cladM=+document.getElementById("cladMarks").value;
  if(cladM){
    if(cladM<0||cladM>100){error="Invalid CLAD Marks";}
    else{
      total+=getCEGP(cladM)*1;
      credits+=1;
    }
  }

  if(error){document.getElementById("error").innerText=error;return;}
  document.getElementById("error").innerText="";
  document.getElementById("result").innerText="🎯 SGPA = "+(total/credits).toFixed(2);
};




