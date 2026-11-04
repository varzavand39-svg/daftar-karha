const $=id=>document.getElementById(id);
const KEY='daftar-karha-v1';
let tasks=JSON.parse(localStorage.getItem(KEY)||'[]');
const fa=n=>new Intl.NumberFormat('fa-IR').format(n);
function save(){localStorage.setItem(KEY,JSON.stringify(tasks));render()}
function today(){return new Date().toISOString().slice(0,10)}
function report(){if(!tasks.length)return 'دفتر کارهای من: هنوز مأموریتی ثبت نشده است.';return 'گزارش دفتر کارهای من\\n'+tasks.map((t,i)=>`${i+1}. ${t.title}\\nواحد: ${t.unit} | اولویت: ${t.priority} | مهلت: ${t.due||'تعیین نشده'} | وضعیت: ${t.done?'انجام‌شده':'باز'}`).join('\\n\\n')}
function render(){
 const open=tasks.filter(t=>!t.done),done=tasks.filter(t=>t.done),due=open.filter(t=>t.due===today());
 $('openCount').textContent=fa(open.length);$('todayCount').textContent=fa(due.length);$('doneCount').textContent=fa(done.length);
 const f=$('filter').value;const shown=tasks.filter(t=>f==='all'||(f==='open'?!t.done:t.done));
 $('tasks').innerHTML=shown.length?shown.map(t=>`<article class="task"><div class="task-top"><div><h3>${escapeHtml(t.title)}</h3><div class="meta">${escapeHtml(t.unit)} · اولویت ${escapeHtml(t.priority)}<br>مهلت: ${t.due?new Date(t.due+'T12:00:00').toLocaleDateString('fa-IR'):'تعیین نشده'}</div></div><span class="pill ${t.done?'done':''}">${t.done?'انجام‌شده':'باز'}</span></div><div class="actions"><button class="finish" data-action="toggle" data-id="${t.id}">${t.done?'بازگردانی':'انجام شد'}</button><button data-action="delete" data-id="${t.id}">حذف</button></div></article>`).join(''):'<div class="empty">فعلاً کاری در این بخش نیست.</div>';
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('taskForm').addEventListener('submit',e=>{e.preventDefault();tasks.unshift({id:Date.now().toString(),title:$('taskTitle').value.trim(),unit:$('unit').value,priority:$('priority').value,due:$('due').value,done:false});$('taskForm').reset();$('priority').value='بالا';save()});
$('tasks').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.id;if(b.dataset.action==='toggle')tasks=tasks.map(t=>t.id===id?{...t,done:!t.done}:t);if(b.dataset.action==='delete')tasks=tasks.filter(t=>t.id!==id);save()});
$('filter').addEventListener('change',render);
$('shareAll').addEventListener('click',async()=>{const text=report();try{if(navigator.share)await navigator.share({title:'گزارش دفتر کارها',text});else{await navigator.clipboard.writeText(text);alert('گزارش کپی شد؛ آن را در گفت‌وگوی دستیار جای‌گذاری کن.')}}catch(e){}});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
render();