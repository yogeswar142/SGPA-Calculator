import "./style.css";

/* ---------- GRADE MAP ---------- */
const gradePoints = { "O":10,"A+":9,"A":8,"B+":7,"B":6,"C":5,"P":4,"I":4 };
const grades = ["O","A+","A","B+","B","C","P","I"];
const subjectTypes = ["Normal","Lab","CLAD"];

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
function getCEGP(m){
  return getLabGP(m); // same CE table
}

/* ---------- UI ---------- */
function gradeSelect(cls){
  return `<select class="border p-2 w-full ${cls}">
    <option value="">Select</option>
    ${grades.map(g=>`<option value="${g}">${g}</option>`).join("")}
  </select>`;
}
function typeSelect(cls){
  return `<select class="border p-2 w-full ${cls}">
    ${subjectTypes.map(t=>`<option>${t}</option>`).join("")}
  </select>`;
}

document.getElementById("app").innerHTML = `
<div class="max-w-6xl mx-auto p-4">
<div class="bg-white p-4 rounded-xl shadow-xl">
<h1 class="text-2xl font-bold text-center text-indigo-700 mb-4">GITAM SGPA Calculator</h1>

<div class="hidden md:block overflow-x-auto">
<table class="min-w-[1000px] w-full border" id="table">
<tr class="bg-indigo-100">
<th>Subject</th><th>Credits</th><th>Type</th><th>S1</th><th>LE</th><th>S2</th><th>Lab</th><th>CLAD</th><th></th>
</tr>
</table>
</div>

<div id="mobileCards" class="md:hidden space-y-4"></div>

<div class="flex gap-3 mt-4">
<button id="add" class="bg-indigo-600 text-white px-4 py-2 rounded w-full">➕ Add</button>
<button id="calc" class="bg-green-600 text-white px-4 py-2 rounded w-full">📊 Calculate</button>
</div>

<div id="error" class="text-red-600 mt-3"></div>
<div id="result" class="text-2xl text-indigo-700 font-bold mt-4 text-center"></div>
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

/* ---------- ROW / CARD ---------- */
function createRow(){
  const tr=document.createElement("tr");
  tr.innerHTML=`
<td><input class="border p-1"/></td>
<td><input type="number" class="border p-1 credits"/></td>
<td>${typeSelect("type")}</td>
<td>${gradeSelect("s1")}</td>
<td>${gradeSelect("le")}</td>
<td>${gradeSelect("s2")}</td>
<td><input type="number" class="border p-1 lab hidden"/></td>
<td><input type="number" class="border p-1 clad hidden"/></td>
<td><button class="remove text-red-600">❌</button></td>`;
  return tr;
}

function createCard(){
  const d=document.createElement("div");
  d.className="bg-indigo-50 p-4 rounded";
  d.innerHTML=`
<input class="border p-2 w-full mb-2" placeholder="Subject"/>
<input type="number" class="border p-2 w-full mb-2 credits" placeholder="Credits"/>
<label>Type</label>${typeSelect("type")}
<label>S1</label>${gradeSelect("s1")}
<label>LE</label>${gradeSelect("le")}
<label>S2</label>${gradeSelect("s2")}
<input type="number" class="border p-2 w-full mt-2 lab hidden" placeholder="Lab Marks"/>
<input type="number" class="border p-2 w-full mt-2 clad hidden" placeholder="CLAD Marks"/>
<button class="text-red-600 mt-2 w-full">Remove</button>`;
  return d;
}

/* ---------- ADD ---------- */
document.getElementById("add").onclick=()=>{
 const r=createRow(), c=createCard();
 table.appendChild(r); mobile.appendChild(c);

 r.querySelector(".remove").onclick=()=>{r.remove();c.remove();}
 c.querySelector("button").onclick=()=>{r.remove();c.remove();}

 const sync=(type)=>{
   const showLab = type==="Lab";
   const showCLAD = type==="CLAD";
   r.querySelector(".lab").classList.toggle("hidden",!showLab);
   r.querySelector(".clad").classList.toggle("hidden",!showCLAD);
   c.querySelector(".lab").classList.toggle("hidden",!showLab);
   c.querySelector(".clad").classList.toggle("hidden",!showCLAD);
 };

 r.querySelector(".type").onchange=e=>{
   c.querySelector(".type").value=e.target.value;
   sync(e.target.value);
 };
 c.querySelector(".type").onchange=e=>{
   r.querySelector(".type").value=e.target.value;
   sync(e.target.value);
 };
};
document.getElementById("add").click();

/* ---------- CALCULATE ---------- */
document.getElementById("calc").onclick=()=>{
 const rows = window.innerWidth<768?mobile.children:table.querySelectorAll("tr:not(:first-child)");
 let total=0, credits=0, error="";

 [...rows].forEach(r=>{
   const g=cls=>r.querySelector(cls)?.value;
   const c=+g(".credits"), type=g(".type");
   if(!c||!type){error="Fill all fields";return;}

   let gp=0;
   if(type==="CLAD"){
     const m=+g(".clad");
     if(m<0||m>100){error="Invalid CLAD marks";return;}
     gp=getCEGP(m);
   } else {
     const s1=g(".s1"),le=g(".le"),s2=g(".s2");
     if(!s1||!le||!s2){error="Fill S1, LE, S2";return;}
     const wgp=gradePoints[s1]*.3+gradePoints[le]*.25+gradePoints[s2]*.45;
     gp=getTheoryGP(wgp);
     if(type==="Lab"){
       const m=+g(".lab");
       if(m<0||m>100){error="Invalid Lab marks";return;}
       gp=gp*.7+getLabGP(m)*.3;
     }
   }
   total+=gp*c; credits+=c;
 });

 if(error){document.getElementById("error").innerText=error;return;}
 document.getElementById("error").innerText="";
 document.getElementById("result").innerText="🎯 SGPA = "+(total/credits).toFixed(2);
};



