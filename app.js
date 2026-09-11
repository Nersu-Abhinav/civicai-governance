const seedReports = [
  {id:'CIV-1042',category:'Roads & Mobility',department:'Roads Department',priority:'High',location:'Ward 12',summary:'Multiple residents report a large pothole near the main junction.',tags:['pothole','safety','cluster']},
  {id:'CIV-1041',category:'Water Supply',department:'Water Services',priority:'High',location:'Ward 7',summary:'Households report an interruption in water supply since yesterday.',tags:['water','service disruption']},
  {id:'CIV-1040',category:'Waste Management',department:'Sanitation',priority:'Medium',location:'Ward 12',summary:'Repeated garbage accumulation reported near a community market.',tags:['waste','hotspot']},
  {id:'CIV-1039',category:'Street Lighting',department:'Electrical Services',priority:'Low',location:'Ward 4',summary:'Two streetlights are not functioning on a residential lane.',tags:['lighting']}
];

let reports = [...seedReports];

const rules = [
  {keys:['pothole','road','street','traffic','accident'],category:'Roads & Mobility',department:'Roads Department',priority:'High',reason:'Potential public-safety impact combined with transport disruption makes this suitable for high-priority review.'},
  {keys:['water','pipeline','drinking','tap','supply'],category:'Water Supply',department:'Water Services',priority:'High',reason:'A disruption to an essential service can affect multiple households and should be reviewed quickly.'},
  {keys:['garbage','waste','trash','dump','sanitation'],category:'Waste Management',department:'Sanitation',priority:'Medium',reason:'Recurring sanitation issues can create community-level impact; the recommendation is medium until severity is verified.'},
  {keys:['light','streetlight','electricity','lamp'],category:'Street Lighting',department:'Electrical Services',priority:'Low',reason:'The issue appears localized. Priority can increase if safety impact or a wider outage is confirmed.'},
  {keys:['school','student','classroom','teacher'],category:'Education',department:'Education Services',priority:'Medium',reason:'Education-service disruption can affect a defined community and merits timely departmental review.'}
];

function analyzeIssue(){
  const message = document.getElementById('message').value.trim();
  const location = document.getElementById('location').value.trim() || 'Location not specified';
  const language = document.getElementById('language').value;
  if(!message){ alert('Please enter a citizen report first.'); return; }
  const lower = message.toLowerCase();
  const match = rules.find(r => r.keys.some(k => lower.includes(k))) || {category:'General Public Service',department:'Citizen Services',priority:'Medium',reason:'The issue needs human review because the prototype could not confidently map it to a specific service category.'};
  const detected = language === 'Auto-detect' ? detectLanguage(message) : language;
  const summary = `Citizen report from ${location}: ${message.length > 135 ? message.slice(0,132)+'…' : message}`;
  const item = {id:'CIV-'+(1043+reports.length),category:match.category,department:match.department,priority:match.priority,location,summary,tags:[match.category.toLowerCase(),detected.toLowerCase()]};
  reports.unshift(item);

  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('confidence').textContent = match.category === 'General Public Service' ? 'Human review' : 'Prototype confidence';
  document.getElementById('summary').textContent = summary;
  document.getElementById('category').textContent = match.category;
  document.getElementById('department').textContent = match.department;
  document.getElementById('priority').textContent = match.priority;
  document.getElementById('detectedLanguage').textContent = detected;
  document.getElementById('reason').textContent = match.reason;
  document.getElementById('tags').innerHTML = item.tags.map(t=>`<span class="tag">#${t}</span>`).join('');
  renderDashboard();
}

function detectLanguage(text){
  if(/[\u0C00-\u0C7F]/.test(text)) return 'Telugu';
  if(/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if(/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
  if(/[\u0C80-\u0CFF]/.test(text)) return 'Kannada';
  return 'English';
}

function renderDashboard(){
  document.getElementById('totalIssues').textContent = reports.length;
  document.getElementById('urgentIssues').textContent = reports.filter(r=>r.priority==='High').length;
  document.getElementById('departments').textContent = new Set(reports.map(r=>r.department)).size;

  const priorityCounts = ['High','Medium','Low'].map(p=>[p,reports.filter(r=>r.priority===p).length]);
  const deptMap = {};
  reports.forEach(r=>deptMap[r.department]=(deptMap[r.department]||0)+1);
  const maxP = Math.max(1,...priorityCounts.map(x=>x[1]));
  document.getElementById('priorityBars').innerHTML = priorityCounts.map(([k,v])=>`<div class="bar-row"><div class="bar-label"><span>${k}</span><b>${v}</b></div><div class="bar"><i style="width:${v/maxP*100}%"></i></div></div>`).join('');
  const depts = Object.entries(deptMap).sort((a,b)=>b[1]-a[1]);
  const maxD = Math.max(1,...depts.map(x=>x[1]));
  document.getElementById('departmentBars').innerHTML = depts.slice(0,5).map(([k,v])=>`<div class="bar-row"><div class="bar-label"><span>${k}</span><b>${v}</b></div><div class="bar"><i style="width:${v/maxD*100}%"></i></div></div>`).join('');
  document.getElementById('recentReports').innerHTML = reports.slice(0,5).map(r=>`<div class="report"><strong>${r.id} · ${r.category}</strong><small>${r.location} · <span class="priority-${r.priority.toLowerCase()}">${r.priority}</span></small></div>`).join('');
}

function resetDemo(){ reports=[...seedReports]; document.getElementById('message').value=''; document.getElementById('location').value=''; document.getElementById('result').classList.add('hidden'); document.getElementById('emptyState').classList.remove('hidden'); document.getElementById('confidence').textContent='Waiting'; renderDashboard(); }

renderDashboard();
