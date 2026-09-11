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

function setLoading(isLoading){
  const button=document.getElementById('analyzeButton');
  button.disabled=isLoading;
  button.innerHTML=isLoading?'Analyzing securely… <span>✦</span>':'Analyze with CivicAI <span>→</span>';
}

function detectLanguage(text){
  if(/[\u0C00-\u0C7F]/.test(text)) return 'Telugu';
  if(/[\u0900-\u097F]/.test(text)) return 'Hindi';
  if(/[\u0B80-\u0BFF]/.test(text)) return 'Tamil';
  if(/[\u0C80-\u0CFF]/.test(text)) return 'Kannada';
  return 'English';
}

function localAnalyze(message, location, language){
  const lower=message.toLowerCase();
  const match=rules.find(r=>r.keys.some(k=>lower.includes(k)))||{category:'General Public Service',department:'Citizen Services',priority:'Medium',reason:'The prototype could not confidently map this report to a specific service category, so human review is recommended.'};
  const detected=language==='Auto-detect'?detectLanguage(message):language;
  return {summary:`Citizen report from ${location}: ${message.length>135?message.slice(0,132)+'…':message}`,category:match.category,department:match.department,priority:match.priority,language:detected,confidence:match.category==='General Public Service'?0.55:0.88,reason:match.reason,tags:[match.category.toLowerCase(),detected.toLowerCase()],humanReview:match.category==='General Public Service',signals:[{name:'Source',value:'Local prototype fallback'},{name:'Safety',value:match.priority==='High'?'Review quickly':'Standard review'}]};
}

async function readImage(){
  const file=document.getElementById('photoInput').files[0];
  if(!file) return null;
  return await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve({data:String(reader.result).split(',')[1],mimeType:file.type});
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}

async function analyzeIssue(){
  const message=document.getElementById('message').value.trim();
  const location=document.getElementById('location').value.trim()||'Location not specified';
  const language=document.getElementById('language').value;
  if(!message){alert('Please enter a citizen report first.');return;}
  setLoading(true);
  try{
    const image=await readImage();
    let result=null;
    try{
      const response=await fetch('/api/analyzeIssue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,location,language,imageData:image?.data||'',imageMimeType:image?.mimeType||''})});
      if(response.ok) result=await response.json();
    }catch(_){/* Offline/local fallback */}
    if(!result||result.error) result=localAnalyze(message,location,language);
    const item={id:'CIV-'+(1043+reports.length),category:result.category,department:result.department,priority:result.priority,location,summary:result.summary,tags:result.tags||[]};
    reports.unshift(item);
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('confidence').textContent=result.humanReview?'Human review recommended':`${Math.round((result.confidence||0)*100)}% confidence`;
    document.getElementById('summary').textContent=result.summary;
    document.getElementById('category').textContent=result.category;
    document.getElementById('department').textContent=result.department;
    document.getElementById('priority').textContent=result.priority;
    document.getElementById('detectedLanguage').textContent=result.language;
    document.getElementById('reason').textContent=result.reason;
    document.getElementById('tags').innerHTML=(result.tags||[]).map(t=>`<span class="tag">#${t}</span>`).join('');
    document.getElementById('signals').innerHTML=(result.signals||[]).map(s=>`<div class="signal"><span>${s.name}</span><b>${s.value}</b></div>`).join('');
    document.getElementById('modeLabel').textContent=result.id?'Live Gemini + Firebase':'Prototype fallback';
    renderDashboard();
  }finally{setLoading(false);}
}

function renderDashboard(){
  document.getElementById('totalIssues').textContent=reports.length;
  document.getElementById('urgentIssues').textContent=reports.filter(r=>r.priority==='High').length;
  document.getElementById('departments').textContent=new Set(reports.map(r=>r.department)).size;
  const priorityCounts=['High','Medium','Low'].map(p=>[p,reports.filter(r=>r.priority===p).length]);
  const deptMap={}; reports.forEach(r=>deptMap[r.department]=(deptMap[r.department]||0)+1);
  const maxP=Math.max(1,...priorityCounts.map(x=>x[1]));
  document.getElementById('priorityBars').innerHTML=priorityCounts.map(([k,v])=>`<div class="bar-row"><div class="bar-label"><span>${k}</span><b>${v}</b></div><div class="bar"><i style="width:${v/maxP*100}%"></i></div></div>`).join('');
  const depts=Object.entries(deptMap).sort((a,b)=>b[1]-a[1]); const maxD=Math.max(1,...depts.map(x=>x[1]));
  document.getElementById('departmentBars').innerHTML=depts.slice(0,5).map(([k,v])=>`<div class="bar-row"><div class="bar-label"><span>${k}</span><b>${v}</b></div><div class="bar"><i style="width:${v/maxD*100}%"></i></div></div>`).join('');
  document.getElementById('recentReports').innerHTML=reports.slice(0,5).map(r=>`<div class="report"><strong>${r.id} · ${r.category}</strong><small>${r.location} · <span class="priority-${r.priority.toLowerCase()}">${r.priority}</span></small></div>`).join('');
}

function resetDemo(){reports=[...seedReports];document.getElementById('message').value='';document.getElementById('location').value='';document.getElementById('result').classList.add('hidden');document.getElementById('emptyState').classList.remove('hidden');document.getElementById('confidence').textContent='Waiting';document.getElementById('modeLabel').textContent='Prototype mode';document.getElementById('photoInput').value='';document.getElementById('fileName').textContent='Optional · JPG, PNG or WebP';renderDashboard();}

document.getElementById('photoInput').addEventListener('change',()=>{const file=document.getElementById('photoInput').files[0];document.getElementById('fileName').textContent=file?file.name:'Optional · JPG, PNG or WebP';});
renderDashboard();
