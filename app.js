const TESTS = [
  {id:"cbc",name:"Complete Blood Count (CBC)",price:350,category:"Blood",desc:"Common blood cell assessment."},
  {id:"hb",name:"Hemoglobin (Hb)",price:150,category:"Blood",desc:"Hemoglobin measurement."},
  {id:"fbs",name:"Blood Sugar (Fasting)",price:100,category:"Diabetes",desc:"Fasting blood glucose."},
  {id:"ppbs",name:"Blood Sugar (PP)",price:120,category:"Diabetes",desc:"Post-meal blood glucose."},
  {id:"hba1c",name:"HbA1c",price:450,category:"Diabetes",desc:"Average blood glucose marker."},
  {id:"lipid",name:"Lipid Profile",price:650,category:"Blood",desc:"Cholesterol and triglyceride profile."},
  {id:"lft",name:"Liver Function Test (LFT)",price:700,category:"Liver",desc:"Liver-related blood markers."},
  {id:"kft",name:"Kidney Function Test (KFT)",price:650,category:"Kidney",desc:"Kidney-related blood markers."},
  {id:"thyroid",name:"Thyroid Profile (T3, T4, TSH)",price:500,category:"Thyroid",desc:"Thyroid hormone profile."},
  {id:"vitd",name:"Vitamin D",price:1000,category:"Vitamin",desc:"Vitamin D level."},
  {id:"b12",name:"Vitamin B12",price:750,category:"Vitamin",desc:"Vitamin B12 level."},
  {id:"urine",name:"Urine Routine",price:150,category:"Urine",desc:"Routine urine examination."},
  {id:"esr",name:"ESR",price:150,category:"Blood",desc:"Erythrocyte sedimentation rate."},
  {id:"crp",name:"CRP",price:450,category:"Blood",desc:"C-reactive protein test."},
  {id:"uric",name:"Uric Acid",price:200,category:"Kidney",desc:"Uric acid measurement."}
];
const PACKAGES = [
  {name:"Basic Health Checkup",price:999,tests:"CBC, blood sugar, urine routine, ESR"},
  {name:"Complete Health Checkup",price:2499,tests:"CBC, glucose, lipid, LFT, KFT, thyroid and urine"},
  {name:"Diabetes Checkup",price:899,tests:"Fasting sugar, PP sugar and HbA1c"},
  {name:"Thyroid Checkup",price:599,tests:"T3, T4 and TSH"}
];
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const $ = id => document.getElementById(id);
const slotTimes = ["6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM"];
let selected = new Set();

function renderTests(){
  const q = ($("testSearch").value || "").toLowerCase();
  const cat = $("categoryFilter").value;
  const list = TESTS.filter(t => (t.name.toLowerCase().includes(q)||t.category.toLowerCase().includes(q)) && (cat==="all"||t.category===cat));
  $("testGrid").innerHTML = list.length ? list.map(t=>`<article class="test-card"><span class="category">${t.category}</span><h3>${t.name}</h3><p>${t.desc}</p><div class="test-card-bottom"><span class="price">${money(t.price)}</span><button class="small-btn" data-add="${t.id}">Add to booking</button></div></article>`).join("") : '<div class="empty">No matching tests found.</div>';
}
function renderPackages(){
  $("packageGrid").innerHTML=PACKAGES.map(p=>`<article class="package-card"><span class="eyebrow">HEALTH PACKAGE</span><h3>${p.name}</h3><strong class="price">${money(p.price)}</strong><p>Illustrative package price</p><p>Includes:</p><p>${p.tests}</p><button class="btn light" data-package="${p.name}">Enquire / book package</button></article>`).join("");
}
function renderBookingTests(){
  $("bookingTestList").innerHTML=TESTS.map(t=>`<label class="test-pick"><input type="checkbox" data-test="${t.id}" ${selected.has(t.id)?"checked":""}><span>${t.name}</span><b>${money(t.price)}</b></label>`).join("");
  updateTotal();
}
function updateTotal(){
  const total=TESTS.filter(t=>selected.has(t.id)).reduce((s,t)=>s+t.price,0);
  $("selectedTotal").textContent=money(total);
}
function showToast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800);}
function getBookings(){try{return JSON.parse(localStorage.getItem("lifekareBookings")||"[]")}catch{return []}}
function setDateMin(){const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());$("appointmentDate").min=d.toISOString().slice(0,10);}
function refreshSlots(){
  const date=$("appointmentDate").value;
  const slot=$("timeSlot");
  if(!date){slot.innerHTML='<option value="">Choose a date first</option>';return;}
  const bookings=getBookings();
  const booked=bookings.filter(b=>b.date===date && b.status!=="Cancelled").map(b=>b.slot);
  const available=slotTimes.filter(t=>!booked.includes(t));
  slot.innerHTML='<option value="">Select time</option>'+available.map(t=>`<option>${t}</option>`).join("");
  if(!available.length)slot.innerHTML='<option value="">No demo slots left for this date</option>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function init(){
  $("year").textContent=new Date().getFullYear();
  renderTests();renderPackages();renderBookingTests();setDateMin();
  $("testSearch").addEventListener("input",renderTests);
  $("categoryFilter").addEventListener("change",renderTests);
  $("testGrid").addEventListener("click",e=>{const id=e.target.dataset.add;if(id){selected.add(id);renderBookingTests();showToast("Test added to your booking.");$("booking").scrollIntoView({behavior:"smooth"});}});
  $("bookingTestList").addEventListener("change",e=>{const id=e.target.dataset.test;if(!id)return;e.target.checked?selected.add(id):selected.delete(id);updateTotal();});
  $("packageGrid").addEventListener("click",e=>{const name=e.target.dataset.package;if(name){showToast(name+" selected. Please contact the lab to confirm package contents and price.");$("booking").scrollIntoView({behavior:"smooth"});}});
  $("appointmentDate").addEventListener("change",refreshSlots);
  $("bookingForm").addEventListener("change",e=>{if(e.target.name==="visitType"){const home=e.target.value==="Home collection";$("bookingForm").elements.address.required=home;$("bookingForm").elements.address.placeholder=home?"Enter full home address and PIN code (required)":"Optional address";}});
  $("bookingForm").addEventListener("submit",e=>{
    e.preventDefault();
    if(!selected.size){$("bookingMessage").textContent="Please select at least one test.";return;}
    const form=e.currentTarget, data=Object.fromEntries(new FormData(form).entries());
    if(data.visitType==="Home collection"&&!data.address.trim()){form.elements.address.focus();return;}
    const current=getBookings();
    if(current.some(b=>b.date===data.date&&b.slot===data.slot&&b.status!=="Cancelled")){$("bookingMessage").textContent="That time slot has just been taken in this browser. Please choose another.";refreshSlots();return;}
    const tests=TESTS.filter(t=>selected.has(t.id));
    const total=tests.reduce((s,t)=>s+t.price,0);
    const booking={id:"LK"+Date.now().toString().slice(-8),createdAt:new Date().toISOString(),...data,tests:tests.map(t=>({name:t.name,price:t.price})),total,status:"Request received"};
    current.push(booking);localStorage.setItem("lifekareBookings",JSON.stringify(current));
    $("bookingMessage").textContent=`Booking request saved on this device. Your reference ID is ${booking.id}. Please call 7207009739 to confirm availability.`;
    showToast("Request saved. Reference: "+booking.id);
    const receipt=`Lifekare Diagnostic Lab\nBooking reference: ${booking.id}\nPatient: ${booking.name}\nMobile: ${booking.phone}\nType: ${booking.visitType}\nDate: ${booking.date}\nTime: ${booking.slot}\nTests: ${tests.map(t=>t.name).join(", ")}\nIllustrative total: ${money(total)}\nPayment: ${booking.payment}\nStatus: Request received (not yet confirmed)\nPlease call 7207009739 to confirm.`;
    const blob=new Blob([receipt],{type:"text/plain"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`Lifekare-${booking.id}.txt`;a.click();URL.revokeObjectURL(url);
    selected.clear();form.reset();$("bookingForm").elements.address.required=false;renderBookingTests();refreshSlots();
  });
  $("menuToggle").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
  $("mainNav").addEventListener("click",e=>{if(e.target.tagName==="A")$("mainNav").classList.remove("open");});
  renderTests();
}
document.addEventListener("DOMContentLoaded",init);
