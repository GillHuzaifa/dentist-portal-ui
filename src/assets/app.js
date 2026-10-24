/* ============================= STATE ============================= */
const STORAGE_KEY = 'dentistPortalState_v2';
const DEPARTMENTS = ['General Dentistry','Orthodontics','Endodontics','Periodontics','Oral & Maxillofacial Surgery','Pediatric Dentistry','Prosthodontics'];
const DEPT_COLORS = {
  'General Dentistry':['var(--brand-soft)','var(--brand-dark)'],
  'Orthodontics':['var(--violet-soft)','var(--violet)'],
  'Endodontics':['var(--blue-soft)','var(--blue)'],
  'Periodontics':['var(--amber-soft)','var(--amber)'],
  'Oral & Maxillofacial Surgery':['var(--red-soft)','var(--red)'],
  'Pediatric Dentistry':['var(--brand-soft)','var(--brand-dark)'],
  'Prosthodontics':['var(--violet-soft)','var(--violet)']
};
const AVATAR_COLORS = ['#0E9F6E','#2E6FEE','#7C5CFC','#D98A1F','#E5484D','#12A6C9'];

function uid(prefix){ return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function todayStr(){ return new Date().toISOString().slice(0,10); }
function fmtDate(d){ const dt = new Date(d); return dt.toLocaleDateString(undefined,{weekday:'short', day:'2-digit', month:'short'}); }
function fmtMoney(n){ return 'Rs ' + Number(n).toLocaleString(); }
function initials(name){ return name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join(''); }
function colorFor(str){ let h=0; for(const c of str) h = (h*31 + c.charCodeAt(0))>>>0; return AVATAR_COLORS[h % AVATAR_COLORS.length]; }

function seedState(){
  const doctors = [
    {id:uid('doc'), name:'Dr. Ahsan Raza', dept:'General Dentistry', status:'on'},
    {id:uid('doc'), name:'Dr. Sara Khan', dept:'Orthodontics', status:'on'},
    {id:uid('doc'), name:'Dr. Bilal Aslam', dept:'Endodontics', status:'off'},
    {id:uid('doc'), name:'Dr. Hina Farooq', dept:'Periodontics', status:'on'},
    {id:uid('doc'), name:'Dr. Usman Tariq', dept:'Oral & Maxillofacial Surgery', status:'off'},
    {id:uid('doc'), name:'Dr. Ayesha Malik', dept:'Pediatric Dentistry', status:'on'},
    {id:uid('doc'), name:'Dr. Zain Abbas', dept:'Prosthodontics', status:'on'}
  ];
  const procedures = [
    {id:uid('proc'), name:'Scaling & Polishing', category:'Preventive', duration:30, price:2500},
    {id:uid('proc'), name:'Fluoride Treatment', category:'Preventive', duration:20, price:1500},
    {id:uid('proc'), name:'Composite Filling', category:'Restorative', duration:45, price:3500},
    {id:uid('proc'), name:'Root Canal Treatment (RCT)', category:'Endodontic', duration:90, price:12000},
    {id:uid('proc'), name:'Tooth Extraction (Simple)', category:'Surgical', duration:30, price:3000},
    {id:uid('proc'), name:'Wisdom Tooth Removal', category:'Surgical', duration:60, price:8000},
    {id:uid('proc'), name:'Crown Placement (Ceramic)', category:'Prosthodontic', duration:60, price:15000},
    {id:uid('proc'), name:'Teeth Whitening', category:'Cosmetic', duration:45, price:9000},
    {id:uid('proc'), name:'Braces Adjustment', category:'Orthodontic', duration:20, price:2000},
    {id:uid('proc'), name:'Dental Implant', category:'Surgical', duration:120, price:60000},
    {id:uid('proc'), name:'Gum Treatment (Root Planing)', category:'Periodontal', duration:60, price:5000},
    {id:uid('proc'), name:'Dental Veneer', category:'Cosmetic', duration:60, price:18000}
  ];
  const pByName = n => procedures.find(p=>p.name===n).id;
  const packages = [
    {id:uid('pkg'), name:'Root Canal + Crown Package', procedureIds:[pByName('Root Canal Treatment (RCT)'), pByName('Crown Placement (Ceramic)')], sessions:3, price:24000, validityDays:90},
    {id:uid('pkg'), name:'Orthodontic Braces Package', procedureIds:[pByName('Braces Adjustment')], sessions:12, price:120000, validityDays:365},
    {id:uid('pkg'), name:'Smile Makeover Package', procedureIds:[pByName('Teeth Whitening'), pByName('Dental Veneer')], sessions:2, price:25000, validityDays:60},
    {id:uid('pkg'), name:'Full Mouth Scaling Package', procedureIds:[pByName('Scaling & Polishing'), pByName('Fluoride Treatment')], sessions:2, price:3800, validityDays:30}
  ];
  const patients = [
    {id:uid('pat'), name:'Muhammad Ali', phone:'0300-1234567', age:34, gender:'Male', createdAt:Date.now()-90*86400000,
      chart:{3:'filled', 14:'cavity', 19:'rct', 30:'crown'},
      xrays:[],
      procedures:[{procedureId:pByName('Composite Filling'), tooth:'3', status:'Completed', cost:3500, date:'2026-08-14'}],
      packages:[]},
    {id:uid('pat'), name:'Ayesha Siddiqui', phone:'0321-9876543', age:27, gender:'Female', createdAt:Date.now()-40*86400000,
      chart:{9:'missing'},
      xrays:[],
      procedures:[],
      packages:[{packageId:packages[1].id, sessionsCompleted:4, startDate:'2026-07-01', status:'Active'}]},
    {id:uid('pat'), name:'Bilal Hussain', phone:'0333-4567890', age:45, gender:'Male', createdAt:Date.now()-5*86400000,
      chart:{}, xrays:[], procedures:[], packages:[]}
  ];
  const now = Date.now();
  const queue = [
    {id:uid('q'), patientId:patients[0].id, patientName:patients[0].name, phone:patients[0].phone, dept:'General Dentistry', doctor:'Dr. Ahsan Raza', type:'Consultation', status:'serving', createdAt: now - 22*60000, servingAt: now - 9*60000},
    {id:uid('q'), patientId:patients[1].id, patientName:patients[1].name, phone:patients[1].phone, dept:'Orthodontics', doctor:'Dr. Sara Khan', type:'Procedure: Braces Adjustment', status:'waiting', createdAt: now - 6*60000, servingAt:null},
    {id:uid('q'), patientId:null, patientName:'Zara Ahmed', phone:'0345-1122334', dept:'Periodontics', doctor:'Dr. Hina Farooq', type:'Consultation', status:'skipped', createdAt: now - 60*60000, servingAt:null},
    {id:uid('q'), patientId:patients[2].id, patientName:patients[2].name, phone:patients[2].phone, dept:'General Dentistry', doctor:'Dr. Ahsan Raza', type:'Consultation', status:'completed', createdAt: now - 120*60000, servingAt: now-110*60000, completedAt: now-95*60000}
  ];
  const appointments = [
    {id:uid('ap'), patientName:'Hassan Raza', phone:'0301-2223344', dept:'Prosthodontics', doctor:'Dr. Zain Abbas', date: new Date(Date.now()+86400000).toISOString().slice(0,10), time:'10:30', type:'Consultation'},
    {id:uid('ap'), patientName:'Mahnoor Tariq', phone:'0312-5566778', dept:'Endodontics', doctor:'Dr. Bilal Aslam', date: new Date(Date.now()+2*86400000).toISOString().slice(0,10), time:'14:00', type:'Procedure: Root Canal Treatment (RCT)'},
    {id:uid('ap'), patientName:'Fatima Noor', phone:'0333-9988776', dept:'Orthodontics', doctor:'Dr. Sara Khan', date: new Date(Date.now()+3*86400000).toISOString().slice(0,10), time:'11:00', type:'Procedure: Braces Adjustment'}
  ];
  return {doctors, procedures, packages, patients, queue, appointments};
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ console.error('load error', e); return null; }
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e){ console.error('save error', e); showToast('Could not save — device storage may be full.'); }
}
let state = loadState() || seedState();
if(!loadState()) saveState();

/* ============================= NAV ============================= */
let currentView = 'dashboard';
let currentPatientId = null;

function navigate(view, opts){
  opts = opts || {};
  currentView = view;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  document.querySelectorAll('.navitem').forEach(n=>n.classList.toggle('active', n.dataset.nav === (view==='patient-detail'?'patients':view)));
  if(view==='dashboard') renderDashboard();
  if(view==='queue') renderQueue();
  if(view==='appointments') renderAppointments();
  if(view==='patients') renderPatientsList();
  if(view==='procedures') renderProcedures();
  if(view==='packages') renderPackages();
  if(view==='doctors') renderDoctors();
  if(view==='history') renderHistory();
  if(view==='patient-detail'){ currentPatientId = opts.patientId; renderPatientDetail(opts.tab||'overview'); }
  window.scrollTo(0,0);
}


function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ============================= MODAL ============================= */
function openModal(html, wide){
  document.getElementById('modalBody').innerHTML = '<div class="modal'+(wide?' wide':'')+'">'+html+'</div>';
  document.getElementById('overlay').classList.add('show');
}
function closeModal(){ document.getElementById('overlay').classList.remove('show'); }
// 'click', e=>{ if(e.target.id==='overlay') closeModal(); });
// 

function modalHeader(title, sub, backFn){
  return '<div class="modal-head"><div class="modal-head-left">'+
    (backFn?'<button class="modal-back" onclick="'+backFn+'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>':'')+
    '<div><div class="modal-title">'+title+'</div>'+(sub?'<div class="modal-sub">'+sub+'</div>':'')+'</div></div>'+
    '<button class="modal-close" onclick="closeModal()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div><div class="modal-divider"></div>';
}
function confirmDelete(msg, onConfirmFn){
  openModal(modalHeader('Are you sure?', msg) +
    '<div style="display:flex; gap:10px;">'+
    '<button class="btn btn-ghost" style="flex:1; justify-content:center;" onclick="closeModal()">Cancel</button>'+
    '<button class="btn" style="flex:1; justify-content:center; background:var(--red); color:#fff;" onclick="'+onConfirmFn+'; closeModal();">Delete</button>'+
    '</div>');
}

/* ============================= DASHBOARD ============================= */
function computeStats(){
  const today = state.queue;
  const waiting = today.filter(q=>q.status==='waiting').length;
  const completed = today.filter(q=>q.status==='completed').length;
  const skipped = today.filter(q=>q.status==='skipped').length;
  const completedWithTime = today.filter(q=>q.status==='completed' && q.completedAt && q.createdAt);
  const avgWait = completedWithTime.length ? Math.round(completedWithTime.reduce((a,q)=>a+(q.completedAt-q.createdAt),0)/completedWithTime.length/60000) : 0;
  return {waiting, completed, skipped, avgWait};
}
function renderDashboard(){
  const s = computeStats();
  document.getElementById('statsRow').innerHTML = [
    ['Waiting', s.waiting], ['Completed', s.completed], ['Skipped', s.skipped], ['Avg Wait', s.avgWait+' min']
  ].map(([label,val])=>'<div class="stat-card"><div class="stat-label">'+label+'</div><div class="stat-value'+(label==='Avg Wait'?' small':'')+'">'+val+'</div></div>').join('');

  const deptGroups = {};
  DEPARTMENTS.forEach(d=>deptGroups[d] = {serving:0, oncall: state.doctors.filter(doc=>doc.dept===d && doc.status==='on').length});
  state.queue.filter(q=>q.status==='serving').forEach(q=>{ if(deptGroups[q.dept]) deptGroups[q.dept].serving++; });
  const activeDepts = DEPARTMENTS.filter(d=>deptGroups[d].oncall>0 || deptGroups[d].serving>0);
  document.getElementById('servingList').innerHTML = activeDepts.length ? activeDepts.map(d=>{
    const g = deptGroups[d]; const colors = DEPT_COLORS[d];
    return '<div class="serving-row" onclick="this.classList.toggle(\'open\'); this.nextElementSibling.style.display=this.classList.contains(\'open\')?\'block\':\'none\';">'+
      '<svg class="chev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'+
      '<div class="dept-icon" style="background:'+colors[0]+'; color:'+colors[1]+';"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg></div>'+
      '<span class="dept-name">'+d+'</span><span class="dept-meta">'+g.oncall+' Doctor'+(g.oncall!==1?'s':'')+' On-duty</span>'+
      '<span class="row-spacer"></span><span class="badge-serving">SERVING '+g.serving+'</span></div>'+
      '<div class="serving-detail" style="display:none;">'+(g.serving? g.serving+' patient(s) currently being seen in this department.' : 'No patients currently in this department\'s queue.')+'</div>';
  }).join('') : '<div class="empty-state"><span>No departments on duty right now.</span></div>';

  const skipped = state.queue.filter(q=>q.status==='skipped');
  document.getElementById('skippedList').innerHTML = skipped.length ? '<div class="serving-list">'+skipped.map(q=>
    '<div class="serving-row" style="cursor:default;"><div class="dept-icon" style="background:var(--red-soft); color:var(--red);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></div>'+
    '<div><div class="dept-name">'+q.patientName+'</div><div class="dept-meta" style="margin-left:0;">'+q.dept+'</div></div>'+
    '<span class="row-spacer"></span><button class="btn btn-ghost btn-sm" onclick="requeue(\''+q.id+'\')">Re-queue</button></div>'
  ).join('')+'</div>' :
    '<div class="empty-state"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M8.5 12.5l2.3 2.3L16 10"/></svg><span>No skipped patients</span></div>';

  renderDistribution();
}
function requeue(id){
  const q = state.queue.find(x=>x.id===id); if(q){ q.status='waiting'; saveState(); showToast('Patient re-queued.'); }
  if(currentView==='dashboard') renderDashboard(); if(currentView==='queue') renderQueue();
}
function donutStyle(segments){
  let acc=0; const parts=[];
  segments.forEach(seg=>{ const start=acc; acc+=seg.pct; parts.push(seg.color+' '+start+'% '+acc+'%'); });
  if(acc<100) parts.push('var(--track) '+acc+'% 100%');
  return 'background:conic-gradient('+parts.join(',')+');';
}
function renderDistribution(){
  const todayQ = state.queue;
  const slots = {Morning:0, Afternoon:0, Evening:0};
  todayQ.forEach(q=>{ const h = new Date(q.createdAt).getHours(); if(h<12) slots.Morning++; else if(h<17) slots.Afternoon++; else slots.Evening++; });
  const totalToday = todayQ.length;
  const slotColors = ['var(--brand)','var(--blue)','var(--violet)'];
  const slotSubs = {Morning:'Morning', Afternoon:'Afternoon', Evening:'Evening'};
  const slotEntries = Object.entries(slots);
  const segs1 = slotEntries.map(([k,v],i)=>({pct: totalToday? Math.round(v/totalToday*100):0, color:slotColors[i]}));

  const dates = [0,1,2].map(i=> new Date(Date.now()+ (i+1)*86400000).toISOString().slice(0,10));
  const dateLabels = ['Tomorrow','Day 2','Day 3'];
  const apCounts = dates.map(d=> state.appointments.filter(a=>a.date===d).length);
  const totalAp = apCounts.reduce((a,b)=>a+b,0);
  const segs2 = apCounts.map((v,i)=>({pct: totalAp? Math.round(v/totalAp*100):0, color:slotColors[i]}));

  function card(eyebrow,title,pillText,total,rows,segs){
    return '<div class="panel"><div class="dist-card-head"><div><div class="dist-eyebrow">'+eyebrow+'</div><div class="dist-title">'+title+'</div></div><span class="pill">'+pillText+'</span></div>'+
    '<div class="dist-body"><div class="donut" style="'+donutStyle(segs)+'"><div class="donut-hole"><div class="donut-num">'+total+'</div><div class="donut-label">total<br>patients</div></div></div>'+
    '<div class="slot-list">'+rows+'</div></div></div>';
  }
  const rows1 = slotEntries.map(([k,v],i)=>'<div class="slot-row"><span class="dot" style="background:'+slotColors[i]+';"></span><div class="slot-text"><span class="slot-name">Slot '+(i+1)+'</span><span class="slot-sub">'+slotSubs[k]+'</span></div><div><div class="slot-num">'+v+'</div><div class="slot-pct">'+(totalToday?Math.round(v/totalToday*100):0)+'%</div></div></div>').join('');
  const rows2 = dateLabels.map((lbl,i)=>'<div class="slot-row"><span class="dot" style="background:'+slotColors[i]+';"></span><div class="slot-text"><span class="slot-name">'+lbl+'</span><span class="slot-sub">'+fmtDate(dates[i])+'</span></div><div><div class="slot-num">'+apCounts[i]+'</div><div class="slot-pct">'+(totalAp?Math.round(apCounts[i]/totalAp*100):0)+'%</div></div></div>').join('');

  document.getElementById('distGrid').innerHTML =
    card('Live · Today','Today\'s Patients','By Slot', totalToday, rows1, segs1) +
    card('Upcoming Days','Future Appointments','By Day', totalAp, rows2, segs2);
}

/* ============================= QUEUE ============================= */
let queueFilter = 'all';
function renderQueue(){
  const counts = {all: state.queue.length, waiting:0, serving:0, completed:0, skipped:0};
  state.queue.forEach(q=>counts[q.status]++);
  const tabs = [['all','All'],['waiting','Waiting'],['serving','Serving'],['completed','Completed'],['skipped','Skipped']];
  document.getElementById('queueTabs').innerHTML = tabs.map(([k,l])=>'<button class="pill'+(queueFilter===k?' active':'')+'" onclick="queueFilter=\''+k+'\'; renderQueue();">'+l+' ('+counts[k]+')</button>').join('');

  const rows = state.queue.filter(q=> queueFilter==='all' || q.status===queueFilter).sort((a,b)=>b.createdAt-a.createdAt);
  const statusBadge = {waiting:'badge-waiting', serving:'badge-serving2', completed:'badge-completed', skipped:'badge-skipped'};
  document.getElementById('queueTableWrap').innerHTML = rows.length ? '<table class="data"><thead><tr><th>Patient</th><th>Department</th><th>Doctor</th><th>Type</th><th>Status</th><th>Checked in</th><th>Actions</th></tr></thead><tbody>'+
    rows.map(q=>{
      let actions = '';
      if(q.status==='waiting') actions = '<button class="btn btn-blue btn-sm" onclick="setQueueStatus(\''+q.id+'\',\'serving\')">Start Serving</button> <button class="btn btn-ghost btn-sm" onclick="setQueueStatus(\''+q.id+'\',\'skipped\')">Skip</button>';
      else if(q.status==='serving') actions = '<button class="btn btn-brand btn-sm" onclick="setQueueStatus(\''+q.id+'\',\'completed\')">Mark Completed</button> <button class="btn btn-ghost btn-sm" onclick="setQueueStatus(\''+q.id+'\',\'skipped\')">Skip</button>';
      else if(q.status==='skipped') actions = '<button class="btn btn-ghost btn-sm" onclick="requeue(\''+q.id+'\')">Re-queue</button>';
      else actions = '<span class="cell-muted">—</span>';
      return '<tr><td><div class="name-cell"><div class="avatar" style="background:'+colorFor(q.patientName)+';">'+initials(q.patientName)+'</div><div><div class="cell-strong">'+q.patientName+'</div><div class="cell-muted">'+q.phone+'</div></div></div></td>'+
      '<td>'+q.dept+'</td><td>'+q.doctor+'</td><td>'+q.type+'</td>'+
      '<td><span class="badge '+statusBadge[q.status]+'">'+q.status.charAt(0).toUpperCase()+q.status.slice(1)+'</span></td>'+
      '<td class="cell-muted">'+new Date(q.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})+'</td>'+
      '<td>'+actions+'</td></tr>';
    }).join('')+'</tbody></table>' : '<div class="empty-state"><strong>Nothing here yet</strong><span>No patients in this filter.</span></div>';
}
function setQueueStatus(id, status){
  const q = state.queue.find(x=>x.id===id); if(!q) return;
  q.status = status;
  if(status==='serving') q.servingAt = Date.now();
  if(status==='completed') q.completedAt = Date.now();
  saveState(); renderQueue(); showToast('Status updated to '+status+'.');
}
// 

/* ============================= WALK-IN / NEW PATIENT FLOW ============================= */
let walkin = {};
function openWalkinStep1(){
  walkin = {future:false};
  openModal(modalHeader('New Walk-in Patient','Select the type of visit for this patient.') +
    '<div class="choice-grid">'+
    '<div class="choice-card" onclick="walkin.type=\'Consultation\'; openWalkinPickDoctor();"><div class="choice-icon" style="background:var(--brand-soft); color:var(--brand-dark);"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-2.5 0-4.5 1.4-5.7 3.1"/><circle cx="12" cy="12" r="9"/></svg></div><div class="choice-title">Consultation</div><div class="choice-desc">Standard check-up, diagnosis, or follow-up.</div></div>'+
    '<div class="choice-card" onclick="openWalkinProcedure();"><div class="choice-icon" style="background:var(--violet-soft); color:var(--violet);"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2.5l7 7L11 20l-6.5 1.5L6 15z"/></svg></div><div class="choice-title">Procedure</div><div class="choice-desc">Filling, RCT, extraction, or multi-session treatment.</div></div>'+
    '</div>');
}
function openWalkinPickDoctor(){
  walkin.type = walkin.type || 'Consultation';
  const deptOptions = DEPARTMENTS.map(d=>'<option value="'+d+'">'+d+'</option>').join('');
  openModal(modalHeader('Pick Doctor','Select department & doctor for consultation.', 'openWalkinStep1()') +
    '<div class="field"><label class="field-label">Select Department *</label><select id="wDept" onchange="wUpdateDoctors()"><option value="">Choose a department…</option>'+deptOptions+'</select></div>'+
    '<div class="field"><label class="field-label">Select Doctor</label><select id="wDoctor"><option value="">Choose a specific doctor…</option></select></div>'+
    '<div class="checkbox-row"><input type="checkbox" id="wAnyDoctor"><label for="wAnyDoctor">Assign any available doctor</label></div>'+
    '<div class="field"><label class="field-label">Is this a future appointment?</label><div class="toggle-row">'+
    '<div class="toggle-opt selected" onclick="wToggleFuture(this,false)"><span class="radio-dot"></span> No (Today / Walk-in)</div>'+
    '<div class="toggle-opt" onclick="wToggleFuture(this,true)"><span class="radio-dot"></span> Yes (Future Appointment)</div></div></div>'+
    '<button class="btn btn-brand btn-full" onclick="openWalkinContact()">Next: Contact Details</button>');
}
function wUpdateDoctors(){
  const dept = document.getElementById('wDept').value;
  const list = state.doctors.filter(d=>d.dept===dept);
  document.getElementById('wDoctor').innerHTML = '<option value="">Choose a specific doctor…</option>'+list.map(d=>'<option value="'+d.name+'">'+d.name+' ('+ (d.status==='on'?'On-duty':'Off-duty') +')</option>').join('');
}
function wToggleFuture(el, val){
  el.parentElement.querySelectorAll('.toggle-opt').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected'); walkin.future = val;
}
function openWalkinContact(){
  const dept = document.getElementById('wDept') ? document.getElementById('wDept').value : '';
  const anyDoctor = document.getElementById('wAnyDoctor') ? document.getElementById('wAnyDoctor').checked : false;
  let doctor = document.getElementById('wDoctor') ? document.getElementById('wDoctor').value : '';
  if(!dept){ showToast('Please select a department.'); return; }
  if(anyDoctor){ const avail = state.doctors.filter(d=>d.dept===dept && d.status==='on'); doctor = avail.length? avail[0].name : (state.doctors.find(d=>d.dept===dept)||{name:'Unassigned'}).name; }
  if(!doctor){ showToast('Please select a doctor or assign any available.'); return; }
  walkin.dept = dept; walkin.doctor = doctor;
  openModal(modalHeader('Contact Details','Enter the patient\'s details to finish.', 'openWalkinPickDoctor()') +
    (walkin.future? '<div class="form-grid"><div class="field"><label class="field-label">Date</label><input type="date" id="wDate" value="'+todayStr()+'"></div><div class="field"><label class="field-label">Time</label><input type="time" id="wTime" value="10:00"></div></div>':'')+
    '<div class="field"><label class="field-label">Patient Name *</label><input type="text" id="wName" placeholder="Full name"></div>'+
    '<div class="field"><label class="field-label">Phone *</label><input type="tel" id="wPhone" placeholder="03xx-xxxxxxx"></div>'+
    '<button class="btn btn-brand btn-full" onclick="submitWalkin()">'+(walkin.future?'Schedule Appointment':'Add to Queue')+'</button>');
}
function findOrCreatePatient(name, phone){
  let p = state.patients.find(p=>p.phone===phone);
  if(!p){ p = {id:uid('pat'), name, phone, age:null, gender:'', createdAt:Date.now(), chart:{}, xrays:[], procedures:[], packages:[]}; state.patients.push(p); }
  return p;
}
function submitWalkin(){
  const name = document.getElementById('wName').value.trim();
  const phone = document.getElementById('wPhone').value.trim();
  if(!name || !phone){ showToast('Name and phone are required.'); return; }
  if(walkin.future){
    const date = document.getElementById('wDate').value; const time = document.getElementById('wTime').value;
    state.appointments.push({id:uid('ap'), patientName:name, phone, dept:walkin.dept, doctor:walkin.doctor, date, time, type:walkin.type||'Consultation'});
    saveState(); closeModal(); showToast('Appointment scheduled.');
    if(currentView==='appointments') renderAppointments(); if(currentView==='dashboard') renderDashboard();
  } else {
    const patient = findOrCreatePatient(name, phone);
    state.queue.push({id:uid('q'), patientId:patient.id, patientName:name, phone, dept:walkin.dept, doctor:walkin.doctor, type:walkin.type||'Consultation', status:'waiting', createdAt:Date.now(), servingAt:null});
    saveState(); closeModal(); showToast('Patient added to queue.');
    if(currentView==='dashboard') renderDashboard(); if(currentView==='queue') renderQueue();
  }
}
function openWalkinProcedure(){
  walkin.type = 'Procedure';
  openModal(modalHeader('Walk-in Procedure','Look up an existing package or set up a new procedure.', 'openWalkinStep1()') +
    '<div class="field"><label class="field-label">Patient Lookup (Phone, MRN, Name)</label><div class="lookup-row"><input type="text" id="wLookupInput" placeholder="Enter phone, MRN or name..."><button class="btn btn-brand" onclick="wLookupPackage()"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>Lookup</button></div></div>'+
    '<div id="wLookupResult"></div>'+
    '<div class="helper-link">No existing package? <a onclick="openNewProcedureForm()">Set up a new procedure</a></div>');
}
function wLookupPackage(){
  const q = document.getElementById('wLookupInput').value.trim().toLowerCase();
  const box = document.getElementById('wLookupResult');
  if(!q){ box.innerHTML = '<div class="empty-state" style="padding:16px;"><span>Please enter a search query.</span></div>'; return; }
  
  const matches = state.patients.filter(p => p.phone.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  if(!matches.length){ box.innerHTML = '<div class="empty-state" style="padding:16px;"><span>No patient found matching your query.</span></div>'; return; }
  
  let html = '';
  matches.forEach(patient => {
    const activePkgs = patient.packages.filter(pp=>pp.status==='Active');
    if(activePkgs.length) {
      html += '<div class="field-label" style="margin-top:14px;">Active packages for '+patient.name+' ('+patient.phone+')</div>'+activePkgs.map(pp=>{
        const pkg = state.packages.find(p=>p.id===pp.packageId);
        return '<div class="panel" style="padding:12px; margin-bottom:8px; box-shadow:none;"><div class="cell-strong">'+pkg.name+'</div><div class="cell-muted" style="margin:4px 0 8px;">Session '+pp.sessionsCompleted+' of '+pkg.sessions+'</div>'+
          '<button class="btn btn-brand btn-sm" onclick="addSessionAndQueue(\''+patient.id+'\',\''+pp.packageId+'\')">Add Session to Queue</button></div>';
      }).join('');
    } else {
      html += '<div class="empty-state" style="padding:16px;"><span>'+patient.name+' has no active packages.</span></div>';
    }
  });
  box.innerHTML = html;
}
function addSessionAndQueue(patientId, packageId){
  const patient = state.patients.find(p=>p.id===patientId);
  const pkg = state.packages.find(p=>p.id===packageId);
  const pp = patient.packages.find(x=>x.packageId===packageId);
  const dept = DEPARTMENTS[0];
  const doc = state.doctors.find(d=>d.status==='on') || state.doctors[0];
  state.queue.push({id:uid('q'), patientId:patient.id, patientName:patient.name, phone:patient.phone, dept:doc.dept, doctor:doc.name, type:'Procedure: '+pkg.name+' (session)', status:'waiting', createdAt:Date.now(), servingAt:null});
  saveState(); closeModal(); showToast('Session queued for '+patient.name+'.');
  if(currentView==='dashboard') renderDashboard(); if(currentView==='queue') renderQueue();
}
function openNewProcedureForm(){
  const procOptions = state.procedures.map(p=>'<option value="'+p.id+'">'+p.name+' — '+fmtMoney(p.price)+'</option>').join('');
  const docOptions = state.doctors.map(d=>'<option value="'+d.name+'" data-dept="'+d.dept+'">'+d.name+' ('+d.dept+')</option>').join('');
  openModal(modalHeader('New Procedure Visit','Create a walk-in procedure entry.', 'openWalkinProcedure()') +
    '<div class="field"><label class="field-label">Patient Name *</label><input type="text" id="npName"></div>'+
    '<div class="field"><label class="field-label">Phone *</label><input type="tel" id="npPhone" value="'+((document.getElementById('wLookupInput')&&document.getElementById('wLookupInput').value)||'')+'"></div>'+
    '<div class="field"><label class="field-label">Procedure *</label><select id="npProcedure"><option value="">Choose a procedure…</option>'+procOptions+'</select></div>'+
    '<div class="field"><label class="field-label">Doctor *</label><select id="npDoctor"><option value="">Choose a doctor…</option>'+docOptions+'</select></div>'+
    '<button class="btn btn-brand btn-full" onclick="submitNewProcedureVisit()">Add to Queue</button>');
}
function submitNewProcedureVisit(){
  const name = document.getElementById('npName').value.trim();
  const phone = document.getElementById('npPhone').value.trim();
  const procId = document.getElementById('npProcedure').value;
  const docSel = document.getElementById('npDoctor');
  const docName = docSel.value;
  if(!name || !phone || !procId || !docName){ showToast('Please fill all required fields.'); return; }
  const proc = state.procedures.find(p=>p.id===procId);
  const doc = state.doctors.find(d=>d.name===docName);
  const patient = findOrCreatePatient(name, phone);
  patient.procedures.push({procedureId:proc.id, tooth:'', status:'Planned', cost:proc.price, date:todayStr()});
  state.queue.push({id:uid('q'), patientId:patient.id, patientName:name, phone, dept:doc.dept, doctor:doc.name, type:'Procedure: '+proc.name, status:'waiting', createdAt:Date.now(), servingAt:null});
  saveState(); closeModal(); showToast('Procedure visit added to queue.');
  if(currentView==='dashboard') renderDashboard(); if(currentView==='queue') renderQueue();
}
// MOVED
// MOVED

/* ============================= APPOINTMENTS ============================= */
function renderAppointments(){
  const groups = {};
  state.appointments.slice().sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time)).forEach(a=>{ (groups[a.date] = groups[a.date]||[]).push(a); });
  const dates = Object.keys(groups).sort();
  document.getElementById('appointmentsWrap').innerHTML = dates.length ? dates.map(d=>
    '<div class="panel-title" style="margin:18px 0 10px;">'+fmtDate(d)+'</div><div class="panel"><div class="table-wrap"><table class="data"><thead><tr><th>Time</th><th>Patient</th><th>Department</th><th>Doctor</th><th>Type</th><th></th></tr></thead><tbody>'+
    groups[d].map(a=>'<tr><td class="cell-strong">'+a.time+'</td><td><div class="name-cell"><div class="avatar" style="background:'+colorFor(a.patientName)+';">'+initials(a.patientName)+'</div><div><div class="cell-strong">'+a.patientName+'</div><div class="cell-muted">'+a.phone+'</div></div></div></td><td>'+a.dept+'</td><td>'+a.doctor+'</td><td>'+a.type+'</td><td><button class="btn btn-ghost btn-sm" onclick="cancelAppointment(\''+a.id+'\')">Cancel</button></td></tr>').join('')+
    '</tbody></table></div></div>'
  ).join('') : '<div class="panel"><div class="empty-state"><strong>No upcoming appointments</strong><span>Schedule one with "New Appointment".</span></div></div>';
}
function cancelAppointment(id){ state.appointments = state.appointments.filter(a=>a.id!==id); saveState(); renderAppointments(); showToast('Appointment cancelled.'); }
// MOVED EVENT LISTENER walkin.future = true; });

/* ============================= PATIENTS ============================= */
let patientSearchTerm = '';
function renderPatientsList(){
  const term = patientSearchTerm.toLowerCase();
  const rows = state.patients.filter(p=> p.name.toLowerCase().includes(term) || p.phone.includes(term)).sort((a,b)=>b.createdAt-a.createdAt);
  document.getElementById('patientsTableWrap').innerHTML = rows.length ? '<table class="data"><thead><tr><th>Patient</th><th>Age / Gender</th><th>Procedures</th><th>Packages</th><th>Registered</th></tr></thead><tbody>'+
    rows.map(p=>'<tr class="row-click" onclick="navigate(\'patient-detail\',{patientId:\''+p.id+'\'})"><td><div class="name-cell"><div class="avatar" style="background:'+colorFor(p.name)+';">'+initials(p.name)+'</div><div><div class="cell-strong">'+p.name+'</div><div class="cell-muted">'+p.phone+'</div></div></div></td>'+
    '<td class="cell-muted">'+(p.age||'—')+' / '+(p.gender||'—')+'</td>'+
    '<td class="cell-muted">'+p.procedures.length+'</td>'+
    '<td class="cell-muted">'+p.packages.length+'</td>'+
    '<td class="cell-muted">'+new Date(p.createdAt).toLocaleDateString()+'</td></tr>').join('')+'</tbody></table>' :
    '<div class="empty-state"><strong>No patients found</strong><span>Try a different search, or add a new patient.</span></div>';
}
// MOVED EVENT LISTENER });
document.getElementById('btnNewPatient').addEventListener('click', ()=>{
  openModal(modalHeader('New Patient','Create a patient record.') +
    '<div class="form-grid"><div class="field"><label class="field-label">Full Name *</label><input type="text" id="npatName"></div>'+
    '<div class="field"><label class="field-label">Phone *</label><input type="tel" id="npatPhone"></div>'+
    '<div class="field"><label class="field-label">Age</label><input type="number" id="npatAge"></div>'+
    '<div class="field"><label class="field-label">Gender</label><select id="npatGender"><option value="">Select…</option><option>Male</option><option>Female</option><option>Other</option></select></div></div>'+
    '<button class="btn btn-brand btn-full" onclick="submitNewPatient()">Create Patient</button>');
});
function submitNewPatient(){
  const name = document.getElementById('npatName').value.trim();
  const phone = document.getElementById('npatPhone').value.trim();
  const age = document.getElementById('npatAge').value;
  const gender = document.getElementById('npatGender').value;
  if(!name || !phone){ showToast('Name and phone are required.'); return; }
  if(state.patients.some(p=>p.phone===phone)){ showToast('A patient with this phone already exists.'); return; }
  const p = {id:uid('pat'), name, phone, age:age?Number(age):null, gender, createdAt:Date.now(), chart:{}, xrays:[], procedures:[], packages:[]};
  state.patients.push(p); saveState(); closeModal(); showToast('Patient created.');
  navigate('patient-detail', {patientId:p.id});
}

/* ---- patient detail ---- */
const TOOTH_STATES = ['healthy','cavity','filled','crown','rct','missing'];
const TOOTH_COLORS = {healthy:['var(--panel)','var(--text-muted)'], cavity:['var(--red-soft)','var(--red)'], filled:['var(--blue-soft)','var(--blue)'], crown:['var(--amber-soft)','var(--amber)'], rct:['var(--violet-soft)','var(--violet)'], missing:['var(--border-soft)','var(--text-faint)']};
let patientTab = 'overview';
function renderPatientDetail(tab){
  patientTab = tab || patientTab || 'overview';
  const p = state.patients.find(x=>x.id===currentPatientId);
  if(!p){ navigate('patients'); return; }
  document.getElementById('patientHeadWrap').innerHTML =
    '<div class="patient-avatar" style="background:'+colorFor(p.name)+';">'+initials(p.name)+'</div>'+
    '<div><div style="font-size:18px; font-weight:700;">'+p.name+'</div><div class="patient-meta">'+p.phone+' · '+(p.age||'—')+' yrs · '+(p.gender||'—')+' · Registered '+new Date(p.createdAt).toLocaleDateString()+'</div></div>';

  const tabs = [['overview','Overview'],['chart','Dental Chart'],['xrays','X-Rays'],['procedures','Procedures'],['packages','Packages'],['history','History']];
  document.getElementById('patientTabs').innerHTML = tabs.map(([k,l])=>'<div class="tab'+(patientTab===k?' active':'')+'" onclick="navigate(\'patient-detail\',{patientId:\''+p.id+'\',tab:\''+k+'\'})">'+l+'</div>').join('');

  let html = '';
  if(patientTab==='overview'){
    html = '<div class="tabpanel active"><div class="form-grid">'+
      '<div class="panel" style="padding:16px; box-shadow:none;"><div class="stat-label">Procedures on record</div><div class="stat-value small">'+p.procedures.length+'</div></div>'+
      '<div class="panel" style="padding:16px; box-shadow:none;"><div class="stat-label">Active packages</div><div class="stat-value small">'+p.packages.filter(x=>x.status==='Active').length+'</div></div>'+
      '<div class="panel" style="padding:16px; box-shadow:none;"><div class="stat-label">X-rays uploaded</div><div class="stat-value small">'+p.xrays.length+'</div></div>'+
      '<div class="panel" style="padding:16px; box-shadow:none;"><div class="stat-label">Teeth flagged</div><div class="stat-value small">'+Object.keys(p.chart).length+'</div></div>'+
      '</div></div>';
  }
  if(patientTab==='chart'){
    const legend = TOOTH_STATES.map(s=>'<span><span class="legend-swatch" style="background:'+TOOTH_COLORS[s][1]+';"></span>'+s.charAt(0).toUpperCase()+s.slice(1)+'</span>').join('');
    const upper = []; for(let i=1;i<=16;i++) upper.push(i);
    const lower = []; for(let i=17;i<=32;i++) lower.push(i);
    function toothHtml(n){ const st = p.chart[n] || 'healthy'; const c = TOOTH_COLORS[st]; return '<div class="tooth" style="background:'+c[0]+'; color:'+c[1]+'; border-color:'+(st==='healthy'?'var(--border)':c[1])+';" onclick="cycleTooth(\''+p.id+'\','+n+')" title="Tooth '+n+': '+st+'"><span>'+ (st==='missing'?'✕':'') +'</span><span class="tooth-num">'+n+'</span></div>'; }
    html = '<div class="tabpanel active"><div class="chart-legend">'+legend+'</div>'+
      '<div class="tooth-row">'+upper.map(toothHtml).join('')+'</div>'+
      '<div class="tooth-row">'+lower.map(toothHtml).join('')+'</div>'+
      '<div class="cell-muted" style="text-align:center; margin-top:6px;">Click a tooth to cycle its condition.</div></div>';
  }
  if(patientTab==='xrays'){
    html = '<div class="tabpanel active">'+
      '<div class="dropzone" onclick="document.getElementById(\'xrayInput\').click()">'+
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'+
      '<div><strong>Click to upload an X-ray</strong></div><div style="font-size:11.5px; margin-top:4px;">JPG or PNG, stored on this device only</div></div>'+
      '<input type="file" id="xrayInput" accept="image/*" style="display:none" onchange="handleXrayUpload(event,\''+p.id+'\')">'+
      '<div class="xray-grid">'+ (p.xrays.length? p.xrays.map((x,i)=>'<div class="xray-card"><img src="'+x.dataUrl+'" onclick="previewXray(\''+p.id+'\','+i+')"><div class="xray-info"><div class="cell-strong" style="font-size:12px;">'+x.name+'</div><div class="xray-date">'+x.date+'</div></div></div>').join('') : '') +'</div>'+
      (p.xrays.length? '' : '<div class="empty-state" style="padding-top:24px;"><span>No X-rays uploaded yet for this patient.</span></div>') +
      '</div>';
  }
  if(patientTab==='procedures'){
    const procOptions = state.procedures.map(pr=>'<option value="'+pr.id+'">'+pr.name+' — '+fmtMoney(pr.price)+'</option>').join('');
    html = '<div class="tabpanel active">'+
      '<button class="btn btn-brand btn-sm" style="margin-bottom:14px;" onclick="openAddProcedureToPatient(\''+p.id+'\')">+ Assign Procedure</button>'+
      (p.procedures.length? '<table class="data"><thead><tr><th>Procedure</th><th>Tooth</th><th>Status</th><th>Cost</th><th>Date</th></tr></thead><tbody>'+
        p.procedures.map((pp,i)=>{ const pr = state.procedures.find(x=>x.id===pp.procedureId) || {name:'(deleted)'}; return '<tr><td class="cell-strong">'+pr.name+'</td><td class="cell-muted">'+(pp.tooth||'—')+'</td><td><span class="badge '+(pp.status==='Completed'?'badge-completed':pp.status==='In-progress'?'badge-serving2':'badge-waiting')+'">'+pp.status+'</span></td><td class="cell-muted">'+fmtMoney(pp.cost)+'</td><td class="cell-muted">'+pp.date+'</td></tr>'; }).join('')+'</tbody></table>'
        : '<div class="empty-state"><span>No procedures assigned yet.</span></div>')+
      '</div>';
  }
  if(patientTab==='packages'){
    html = '<div class="tabpanel active">'+
      '<button class="btn btn-brand btn-sm" style="margin-bottom:14px;" onclick="openAssignPackageToPatient(\''+p.id+'\')">+ Assign Package</button>'+
      (p.packages.length? p.packages.map((pp,i)=>{ const pkg = state.packages.find(x=>x.id===pp.packageId) || {name:'(deleted)', sessions:1};
        const pct = Math.min(100, Math.round(pp.sessionsCompleted/pkg.sessions*100));
        return '<div class="panel" style="padding:16px; margin-bottom:12px; box-shadow:none;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><div><div class="cell-strong">'+pkg.name+'</div><div class="cell-muted">Started '+pp.startDate+' · '+pp.status+'</div></div>'+
        (pp.status==='Active'? '<button class="btn btn-ghost btn-sm" onclick="addPackageSession(\''+p.id+'\','+i+')">+ Add Session</button>':'')+'</div>'+
        '<div class="progress-bar"><div class="progress-fill" style="width:'+pct+'%;"></div></div><div class="cell-muted" style="margin-top:6px;">Session '+pp.sessionsCompleted+' of '+pkg.sessions+'</div></div>';
      }).join('') : '<div class="empty-state"><span>No packages assigned yet.</span></div>')+
      '</div>';
  }
  if(patientTab==='history'){
    const visits = state.queue.filter(q=>q.patientId===p.id && q.status==='completed').sort((a,b)=>b.createdAt-a.createdAt);
    html = '<div class="tabpanel active">'+ (visits.length? '<table class="data"><thead><tr><th>Date</th><th>Department</th><th>Doctor</th><th>Type</th></tr></thead><tbody>'+
      visits.map(v=>'<tr><td class="cell-muted">'+new Date(v.createdAt).toLocaleDateString()+'</td><td>'+v.dept+'</td><td>'+v.doctor+'</td><td>'+v.type+'</td></tr>').join('')+'</tbody></table>' :
      '<div class="empty-state"><span>No completed visits on record yet.</span></div>')+'</div>';
  }
  document.getElementById('patientTabPanels').innerHTML = html;
}
function cycleTooth(patientId, n){
  const p = state.patients.find(x=>x.id===patientId);
  const cur = p.chart[n] || 'healthy';
  const idx = TOOTH_STATES.indexOf(cur);
  const next = TOOTH_STATES[(idx+1) % TOOTH_STATES.length];
  if(next==='healthy') delete p.chart[n]; else p.chart[n] = next;
  saveState(); renderPatientDetail('chart');
}
function handleXrayUpload(evt, patientId){
  const file = evt.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){
      const maxW = 480;
      const scale = Math.min(1, maxW/img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width*scale; canvas.height = img.height*scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      const p = state.patients.find(x=>x.id===patientId);
      p.xrays.push({id:uid('xr'), name:file.name, dataUrl, date:todayStr()});
      saveState(); renderPatientDetail('xrays'); showToast('X-ray uploaded.');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function previewXray(patientId, idx){
  const p = state.patients.find(x=>x.id===patientId); const x = p.xrays[idx];
  openModal(modalHeader(x.name, 'Uploaded '+x.date) + '<img src="'+x.dataUrl+'" style="width:100%; border-radius:10px; border:1px solid var(--border);">'+
  '<button class="btn btn-soft-red btn-full" onclick="deleteXray(\''+patientId+'\','+idx+')">Delete X-ray</button>', true);
}
function deleteXray(patientId, idx){
  const p = state.patients.find(x=>x.id===patientId); p.xrays.splice(idx,1); saveState(); closeModal(); renderPatientDetail('xrays'); showToast('X-ray removed.');
}
function openAddProcedureToPatient(patientId){
  const procOptions = state.procedures.map(pr=>'<option value="'+pr.id+'" data-price="'+pr.price+'">'+pr.name+' — '+fmtMoney(pr.price)+'</option>').join('');
  openModal(modalHeader('Assign Procedure','Add a procedure to this patient\'s record.') +
    '<div class="field"><label class="field-label">Procedure *</label><select id="apProc">'+procOptions+'</select></div>'+
    '<div class="form-grid"><div class="field"><label class="field-label">Tooth #</label><input type="text" id="apTooth" placeholder="e.g. 14"></div>'+
    '<div class="field"><label class="field-label">Status</label><select id="apStatus"><option>Planned</option><option>In-progress</option><option>Completed</option></select></div></div>'+
    '<div class="field"><label class="field-label">Date</label><input type="date" id="apDate" value="'+todayStr()+'"></div>'+
    '<button class="btn btn-brand btn-full" onclick="submitAddProcedure(\''+patientId+'\')">Add Procedure</button>');
}
function submitAddProcedure(patientId){
  const procId = document.getElementById('apProc').value;
  const proc = state.procedures.find(x=>x.id===procId);
  const p = state.patients.find(x=>x.id===patientId);
  p.procedures.push({procedureId:procId, tooth:document.getElementById('apTooth').value.trim(), status:document.getElementById('apStatus').value, cost:proc.price, date:document.getElementById('apDate').value});
  saveState(); closeModal(); renderPatientDetail('procedures'); showToast('Procedure assigned.');
}
function openAssignPackageToPatient(patientId){
  const pkgOptions = state.packages.map(pk=>'<option value="'+pk.id+'">'+pk.name+' — '+fmtMoney(pk.price)+' ('+pk.sessions+' sessions)</option>').join('');
  openModal(modalHeader('Assign Package','Add a treatment package to this patient.') +
    '<div class="field"><label class="field-label">Package *</label><select id="apkPkg">'+pkgOptions+'</select></div>'+
    '<div class="field"><label class="field-label">Start Date</label><input type="date" id="apkDate" value="'+todayStr()+'"></div>'+
    '<button class="btn btn-brand btn-full" onclick="submitAssignPackage(\''+patientId+'\')">Assign Package</button>');
}
function submitAssignPackage(patientId){
  const pkgId = document.getElementById('apkPkg').value;
  const p = state.patients.find(x=>x.id===patientId);
  p.packages.push({packageId:pkgId, sessionsCompleted:0, startDate:document.getElementById('apkDate').value, status:'Active'});
  saveState(); closeModal(); renderPatientDetail('packages'); showToast('Package assigned.');
}
function addPackageSession(patientId, idx){
  const p = state.patients.find(x=>x.id===patientId); const pp = p.packages[idx];
  const pkg = state.packages.find(x=>x.id===pp.packageId);
  pp.sessionsCompleted = Math.min(pkg.sessions, pp.sessionsCompleted+1);
  if(pp.sessionsCompleted>=pkg.sessions) pp.status='Completed';
  saveState(); renderPatientDetail('packages'); showToast('Session added.');
}

/* ============================= PROCEDURES CATALOG ============================= */
function renderProcedures(){
  document.getElementById('proceduresTableWrap').innerHTML = state.procedures.length ? '<table class="data"><thead><tr><th>Name</th><th>Category</th><th>Duration</th><th>Price</th><th>Actions</th></tr></thead><tbody>'+
    state.procedures.map(pr=>'<tr><td class="cell-strong">'+pr.name+'</td><td><span class="chip">'+pr.category+'</span></td><td class="cell-muted">'+pr.duration+' min</td><td class="cell-muted">'+fmtMoney(pr.price)+'</td>'+
    '<td><button class="btn btn-ghost btn-sm" onclick="openEditProcedure(\''+pr.id+'\')">Edit</button> <button class="btn btn-soft-red btn-sm" onclick="askDeleteProcedure(\''+pr.id+'\')">Delete</button></td></tr>').join('')+'</tbody></table>'
    : '<div class="empty-state"><strong>No procedures yet</strong><span>Add your first procedure to the catalog.</span></div>';
}
const PROC_CATEGORIES = ['Preventive','Restorative','Endodontic','Surgical','Prosthodontic','Cosmetic','Orthodontic','Periodontal'];
function procedureForm(existing){
  const catOptions = PROC_CATEGORIES.map(c=>'<option'+(existing&&existing.category===c?' selected':'')+'>'+c+'</option>').join('');
  return '<div class="field"><label class="field-label">Procedure Name *</label><input type="text" id="pfName" value="'+(existing?existing.name:'')+'"></div>'+
    '<div class="form-grid"><div class="field"><label class="field-label">Category</label><select id="pfCategory">'+catOptions+'</select></div>'+
    '<div class="field"><label class="field-label">Duration (minutes)</label><input type="number" id="pfDuration" value="'+(existing?existing.duration:30)+'"></div></div>'+
    '<div class="field"><label class="field-label">Price (Rs)</label><input type="number" id="pfPrice" value="'+(existing?existing.price:0)+'"></div>'+
    '<button class="btn btn-brand btn-full" onclick="submitProcedureForm('+(existing?"'"+existing.id+"'":'null')+')">'+(existing?'Save Changes':'Add Procedure')+'</button>';
}
// MOVED EVENT LISTENER
function openEditProcedure(id){ const pr = state.procedures.find(x=>x.id===id); openModal(modalHeader('Edit Procedure','Update this catalog entry.') + procedureForm(pr)); }
function askDeleteProcedure(id){ const pr = state.procedures.find(x=>x.id===id); if(!pr) return; confirmDelete('Delete procedure "'+pr.name+'"? Existing patient records that reference it will keep a historical copy.', 'deleteProcedure(\''+id+'\')'); }
function submitProcedureForm(id){
  const name = document.getElementById('pfName').value.trim();
  if(!name){ showToast('Name is required.'); return; }
  const data = {name, category:document.getElementById('pfCategory').value, duration:Number(document.getElementById('pfDuration').value)||0, price:Number(document.getElementById('pfPrice').value)||0};
  if(id){ Object.assign(state.procedures.find(x=>x.id===id), data); showToast('Procedure updated.'); }
  else { state.procedures.push({id:uid('proc'), ...data}); showToast('Procedure added.'); }
  saveState(); closeModal(); renderProcedures();
}
function deleteProcedure(id){ state.procedures = state.procedures.filter(x=>x.id!==id); saveState(); renderProcedures(); showToast('Procedure deleted.'); }

/* ============================= PACKAGES CATALOG ============================= */
function renderPackages(){
  document.getElementById('packagesTableWrap').innerHTML = state.packages.length ? '<table class="data"><thead><tr><th>Name</th><th>Includes</th><th>Sessions</th><th>Price</th><th>Validity</th><th>Actions</th></tr></thead><tbody>'+
    state.packages.map(pk=>{
      const names = pk.procedureIds.map(id=>{ const pr=state.procedures.find(x=>x.id===id); return pr?pr.name:null; }).filter(Boolean);
      return '<tr><td class="cell-strong">'+pk.name+'</td><td>'+names.map(n=>'<span class="chip">'+n+'</span>').join('')+'</td><td class="cell-muted">'+pk.sessions+'</td><td class="cell-muted">'+fmtMoney(pk.price)+'</td><td class="cell-muted">'+pk.validityDays+' days</td>'+
      '<td><button class="btn btn-ghost btn-sm" onclick="openEditPackage(\''+pk.id+'\')">Edit</button> <button class="btn btn-soft-red btn-sm" onclick="askDeletePackage(\''+pk.id+'\')">Delete</button></td></tr>';
    }).join('')+'</tbody></table>'
    : '<div class="empty-state"><strong>No packages yet</strong><span>Bundle procedures into a treatment package.</span></div>';
}
function packageForm(existing){
  const checks = state.procedures.map(pr=>'<label><input type="checkbox" value="'+pr.id+'" '+(existing&&existing.procedureIds.includes(pr.id)?'checked':'')+'> '+pr.name+'</label>').join('');
  return '<div class="field"><label class="field-label">Package Name *</label><input type="text" id="pkfName" value="'+(existing?existing.name:'')+'"></div>'+
    '<div class="field"><label class="field-label">Included Procedures</label><div class="checkbox-list" id="pkfProcs">'+checks+'</div></div>'+
    '<div class="form-grid"><div class="field"><label class="field-label">Sessions</label><input type="number" id="pkfSessions" value="'+(existing?existing.sessions:1)+'"></div>'+
    '<div class="field"><label class="field-label">Price (Rs)</label><input type="number" id="pkfPrice" value="'+(existing?existing.price:0)+'"></div></div>'+
    '<div class="field"><label class="field-label">Validity (days)</label><input type="number" id="pkfValidity" value="'+(existing?existing.validityDays:30)+'"></div>'+
    '<button class="btn btn-brand btn-full" onclick="submitPackageForm('+(existing?"'"+existing.id+"'":'null')+')">'+(existing?'Save Changes':'Add Package')+'</button>';
}
// MOVED EVENT LISTENER
function openEditPackage(id){ const pk = state.packages.find(x=>x.id===id); openModal(modalHeader('Edit Package','Update this treatment package.') + packageForm(pk), true); }
function askDeletePackage(id){ const pk = state.packages.find(x=>x.id===id); if(!pk) return; confirmDelete('Delete package "'+pk.name+'"?', 'deletePackage(\''+id+'\')'); }
function submitPackageForm(id){
  const name = document.getElementById('pkfName').value.trim();
  if(!name){ showToast('Name is required.'); return; }
  const procedureIds = Array.from(document.querySelectorAll('#pkfProcs input:checked')).map(c=>c.value);
  const data = {name, procedureIds, sessions:Number(document.getElementById('pkfSessions').value)||1, price:Number(document.getElementById('pkfPrice').value)||0, validityDays:Number(document.getElementById('pkfValidity').value)||30};
  if(id){ Object.assign(state.packages.find(x=>x.id===id), data); showToast('Package updated.'); }
  else { state.packages.push({id:uid('pkg'), ...data}); showToast('Package added.'); }
  saveState(); closeModal(); renderPackages();
}
function deletePackage(id){ state.packages = state.packages.filter(x=>x.id!==id); saveState(); renderPackages(); showToast('Package deleted.'); }

/* ============================= DOCTORS ============================= */
function renderDoctors(){
  document.getElementById('doctorsTableWrap').innerHTML = state.doctors.length ? '<table class="data"><thead><tr><th>Doctor</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead><tbody>'+
    state.doctors.map(d=>'<tr><td><div class="name-cell"><div class="avatar" style="background:'+colorFor(d.name)+';">'+initials(d.name)+'</div><span class="cell-strong">'+d.name+'</span></div></td><td>'+d.dept+'</td>'+
    '<td><label class="switch"><input type="checkbox" '+(d.status==='on'?'checked':'')+' onchange="toggleDoctorStatus(\''+d.id+'\')"><span class="slider"></span></label> <span class="badge '+(d.status==='on'?'badge-on':'badge-off')+'" style="margin-left:8px;">'+(d.status==='on'?'On-duty':'Off-duty')+'</span></td>'+
    '<td><button class="btn btn-ghost btn-sm" onclick="openEditDoctor(\''+d.id+'\')">Edit</button> <button class="btn btn-soft-red btn-sm" onclick="askDeleteDoctor(\''+d.id+'\')">Remove</button></td></tr>').join('')+'</tbody></table>'
    : '<div class="empty-state"><strong>No doctors yet</strong><span>Add your first doctor to the roster.</span></div>';
}
function toggleDoctorStatus(id){ const d = state.doctors.find(x=>x.id===id); d.status = d.status==='on'?'off':'on'; saveState(); renderDoctors(); if(currentView==='dashboard') renderDashboard(); }
function doctorForm(existing){
  const deptOptions = DEPARTMENTS.map(dp=>'<option'+(existing&&existing.dept===dp?' selected':'')+'>'+dp+'</option>').join('');
  return '<div class="field"><label class="field-label">Doctor Name *</label><input type="text" id="dfName" value="'+(existing?existing.name:'')+'" placeholder="Dr. Full Name"></div>'+
  '<div class="field"><label class="field-label">Department</label><select id="dfDept">'+deptOptions+'</select></div>'+
  '<div class="field"><label class="field-label">Status</label><div class="toggle-row"><div class="toggle-opt'+((!existing||existing.status==='on')?' selected':'')+'" onclick="dfToggle(this,\'on\')"><span class="radio-dot"></span> On-duty</div><div class="toggle-opt'+(existing&&existing.status==='off'?' selected':'')+'" onclick="dfToggle(this,\'off\')"><span class="radio-dot"></span> Off-duty</div></div></div>'+
  '<button class="btn btn-brand btn-full" onclick="submitDoctorForm('+(existing?"'"+existing.id+"'":'null')+',\''+(existing?existing.status:'on')+'\')">'+(existing?'Save Changes':'Add Doctor')+'</button>';
}
let dfStatus = 'on';
function dfToggle(el,val){ el.parentElement.querySelectorAll('.toggle-opt').forEach(o=>o.classList.remove('selected')); el.classList.add('selected'); dfStatus = val; }
// MOVED EVENT LISTENER });
function openEditDoctor(id){ const d = state.doctors.find(x=>x.id===id); dfStatus = d.status; openModal(modalHeader('Edit Doctor',"Update this doctor's details.") + doctorForm(d)); }
function askDeleteDoctor(id){ const d = state.doctors.find(x=>x.id===id); if(!d) return; confirmDelete('Remove "'+d.name+'" from the roster?', 'deleteDoctor(\''+id+'\')'); }
function submitDoctorForm(id){
  const name = document.getElementById('dfName').value.trim();
  if(!name){ showToast('Name is required.'); return; }
  const data = {name, dept:document.getElementById('dfDept').value, status:dfStatus};
  if(id){ Object.assign(state.doctors.find(x=>x.id===id), data); showToast('Doctor updated.'); }
  else { state.doctors.push({id:uid('doc'), ...data}); showToast('Doctor added.'); }
  saveState(); closeModal(); renderDoctors(); if(currentView==='dashboard') renderDashboard();
}
function deleteDoctor(id){ state.doctors = state.doctors.filter(x=>x.id!==id); saveState(); renderDoctors(); showToast('Doctor removed.'); }

/* ============================= HISTORY ============================= */
function renderHistory(){
  const visits = state.queue.filter(q=>q.status==='completed').sort((a,b)=>b.createdAt-a.createdAt);
  document.getElementById('historyTableWrap').innerHTML = visits.length ? '<table class="data"><thead><tr><th>Patient</th><th>Date</th><th>Department</th><th>Doctor</th><th>Type</th></tr></thead><tbody>'+
    visits.map(v=>'<tr'+(v.patientId?' class="row-click" onclick="navigate(\'patient-detail\',{patientId:\''+v.patientId+'\',tab:\'history\'})"':'')+'><td><div class="name-cell"><div class="avatar" style="background:'+colorFor(v.patientName)+';">'+initials(v.patientName)+'</div><span class="cell-strong">'+v.patientName+'</span></div></td>'+
    '<td class="cell-muted">'+new Date(v.createdAt).toLocaleDateString()+'</td><td>'+v.dept+'</td><td>'+v.doctor+'</td><td>'+v.type+'</td></tr>').join('')+'</tbody></table>'
    : '<div class="empty-state"><strong>No completed visits yet</strong><span>Completed queue entries will appear here.</span></div>';
}

/* ============================= INIT ============================= */








  document.querySelectorAll('.navitem[data-nav]').forEach(el=>{
    el.addEventListener('click', ()=> navigate(el.dataset.nav));
  });
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', e=>{ if(e.target.id==='overlay') closeModal(); });
  }
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
  
  const walkinQueueBtn = document.getElementById('btnWalkinQueue');
  if (walkinQueueBtn) walkinQueueBtn.addEventListener('click', ()=>openWalkinStep1());
  
  const searchInput = document.getElementById('patientSearch');
  if (searchInput) {
      searchInput.addEventListener('input', e=>{ 
          patientQuery = e.target.value.toLowerCase(); 
          renderPatientsList(); 
      });
  }

  const walkinTop = document.getElementById('btnWalkinTop');
  if(walkinTop) walkinTop.addEventListener('click', openWalkinStep1);
  const procTop = document.getElementById('btnAddProcedureTop');
  if(procTop) procTop.addEventListener('click', openWalkinProcedure);

  const btnNewAppointment = document.getElementById('btnNewAppointment');
  if (btnNewAppointment) btnNewAppointment.addEventListener('click', ()=>{ openWalkinStep1(); walkin.future = true; });

  const patientSearch = document.getElementById('patientSearch');
  if (patientSearch) patientSearch.addEventListener('input', e=>{ if(typeof patientQuery!=='undefined') patientQuery = e.target.value.toLowerCase(); if(typeof renderPatientsList==='function') renderPatientsList(); });

  const btnNewProcedureCatalog = document.getElementById('btnNewProcedureCatalog');
  if (btnNewProcedureCatalog) btnNewProcedureCatalog.addEventListener('click', ()=> openModal(modalHeader('Add Procedure','New entry in the treatment catalog.') + procedureForm(null)));

  const btnNewPackage = document.getElementById('btnNewPackage');
  if (btnNewPackage) btnNewPackage.addEventListener('click', ()=> openModal(modalHeader('Add Package','Bundle procedures into a treatment package.') + packageForm(null), true));

  const btnNewDoctor = document.getElementById('btnNewDoctor');
  if (btnNewDoctor) btnNewDoctor.addEventListener('click', ()=>{ dfStatus='on'; openModal(modalHeader('Add Doctor','New entry in the doctor roster.') + doctorForm(null)); });

  navigate('dashboard');

