import { createState, contractTotal, money, BILLING_MONTH } from './data.js';
import { escapeHtml as e, icon, panel, muted, primary, secondary, badge, menu, heading, table, cell, detail } from './ui.js';

const main = document.querySelector             ('#main') ;
const navigation = document.querySelector             ('#navigation') ;
const dialog = document.querySelector                   ('#modal') ;
const modalContent = document.querySelector             ('#modal-content') ;
const themeToggle = document.querySelector                   ('#theme-toggle') ;
let state = createState();
const routes = [
  {id:'dashboard',label:'Dashboard',icon:'dashboard'}, {id:'users',label:'Users',icon:'users'},
  {id:'agents',label:'Agents',icon:'agents'}, {id:'skills',label:'Skills',icon:'skills'},
  {id:'contracts',label:'Contracts',icon:'contracts'}, {id:'errors',label:'Error Log',icon:'errors'}
];
                                   
let current        = routes[0] ;
let menuTrigger                           = null;
let dialogOpener                     = null;
let confirmAction                    = null;
let editingAgent                = null;
let noticeTimer = 0;

function notify(message        )       {
  const notice=document.querySelector             ('#notice') ;
  window.clearTimeout(noticeTimer);notice.textContent=message;
  noticeTimer=window.setTimeout(()=>{notice.textContent='';},4000);
}
function initials(name        )         {return name.split(' ').map(x=>x[0]).slice(0,2).join('');}
function nameCell(name        , subtitle        , symbol         )         {
  return `<div class="flex items-center gap-3"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300" aria-hidden="true">${symbol?icon(symbol):e(initials(name))}</span><div><p class="whitespace-nowrap font-medium">${e(name)}</p><p class="mt-1 text-xs ${muted}">${e(subtitle)}</p></div></div>`;
}
function overview()         {
  const monthly=state.contracts.filter(c=>c.paid.startsWith(BILLING_MONTH));
  const cards=[
    {label:'Total revenue',value:money(monthly.reduce((s,c)=>s+contractTotal(c),0)),icon:'money',tone:'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300',note:'Collected in November'},
    {label:'Discount losses',value:money(monthly.reduce((s,c)=>s+c.discount,0)),icon:'tag',tone:'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',note:'Discounts & coupons'},
    {label:'Active agents',value:String(state.agents.filter(a=>a.status==='active').length),icon:'agents',tone:'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300',note:'Across all clients'},
    {label:'Failing agents',value:String(state.agents.filter(a=>a.status==='failing').length),icon:'errors',tone:'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300',note:'Need your attention'}
  ];
  const issues=state.errors.filter(x=>!x.resolved).length;
  return heading('Overview','A clear view of your agent workspace.','November 2026 · Demo period')+
  `<section aria-label="Key metrics" class="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">${cards.map(c=>`<div class="${panel} p-5 lg:p-6"><div class="mb-5 flex items-center justify-between gap-2"><h2 class="text-sm font-medium ${muted}">${c.label}</h2><span class="rounded-lg p-2 ${c.tone}">${icon(c.icon,'h-4 w-4')}</span></div><p class="text-3xl font-semibold tracking-tight">${c.value}</p><p class="mt-2 text-xs ${muted}">${c.note}</p></div>`).join('')}</section>
  <section aria-labelledby="activity-title" class="${panel} mb-7 p-6"><div class="mb-6 flex flex-wrap justify-between gap-3"><div><h2 id="activity-title" class="font-semibold">Weekly activity</h2><p class="mt-1 text-xs ${muted}">Agent execution activity across your workspace</p></div><span class="text-xs ${muted}">Chart preview</span></div><div class="flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-5 text-center dark:border-slate-700 dark:bg-slate-800/30"><span class="rounded-xl bg-white p-3 text-slate-400 shadow-sm dark:bg-slate-800">${icon('chart','h-7 w-7')}</span><p class="text-sm font-medium">Weekly activity chart</p><p class="text-xs ${muted}">Placeholder for backend integration</p></div></section>
  <div class="grid gap-7 xl:grid-cols-5"><section class="${panel} xl:col-span-3"><div class="flex items-center justify-between gap-3 border-b border-slate-100 p-6 dark:border-slate-800"><h2 class="font-semibold">Agent status</h2><a href="#agents" class="text-xs font-medium text-violet-600 hover:underline dark:text-violet-300">View all agents →</a></div><ul class="divide-y divide-slate-100 px-6 dark:divide-slate-800">${state.agents.length?state.agents.map(a=>`<li class="flex items-center justify-between gap-3 py-4">${nameCell(a.name,a.ownerName,a.icon)}${badge(a.status)}</li>`).join(''):`<li class="py-8 text-sm ${muted}">No agents to display.</li>`}</ul></section><section class="${panel} flex flex-col p-6 xl:col-span-2"><span class="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">${icon('errors')}</span><h2 class="font-semibold">Attention required</h2><p class="mt-5 text-3xl font-semibold tracking-tight">${issues} open ${issues===1?'issue':'issues'}</p><p class="mb-7 mt-3 text-sm leading-6 ${muted}">${issues?'Review execution errors and help your agents get back on track.':'All execution errors have been resolved. Your log is up to date.'}</p><a href="#errors" class="${primary} mt-auto self-start">View error log <span aria-hidden="true">→</span></a></section></div>`;
}
function usersView()         {
  return heading('User Management','The people and teams behind your agents.',`${state.users.length} registered users`)+
    table(['User','Email','Plan','Status','<span class="sr-only">Actions</span>'],state.users.map(u=>`<tr>${cell(nameCell(u.name,u.company))}${cell(e(u.email),muted)}${cell(e(u.plan))}${cell(badge(u.status))}${cell(menu('user',u.id,u.name,[{label:'View detail',action:'detail'},{label:'Delete',action:'delete'}]))}</tr>`),'Users');
}
function agentsView()         {
  return heading('Agent Management','Configure the assistants working across your workspace.',`${state.agents.length} agents`)+
    `<section aria-label="Agents" class="grid gap-5 xl:grid-cols-2">${state.agents.length?state.agents.map(a=>`<article class="${panel} overflow-hidden"><div class="p-6"><div class="flex items-start justify-between gap-3">${nameCell(a.name,a.ownerName,a.icon)}${menu('agent',a.id,a.name,[{label:'Configure',action:'configure'},{label:'Delete',action:'delete'}])}</div><p class="mb-5 mt-5 text-sm ${muted}">${e(a.description)}</p>${badge(a.status)}</div><div class="border-t border-slate-100 dark:border-slate-800"><button data-expand="${a.id}" aria-controls="skills-${a.id}" aria-expanded="false" class="flex w-full items-center justify-between px-6 py-4 text-sm font-medium hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-violet-500 dark:hover:bg-slate-800"><span>${a.skills.length} enabled skills</span><span data-chevron class="transition-transform duration-200 motion-reduce:transition-none">${icon('chevron','h-4 w-4')}</span></button><div id="skills-${a.id}" inert aria-hidden="true" class="grid grid-rows-[0fr] opacity-0 transition-all duration-300 motion-reduce:transition-none"><div class="overflow-hidden"><ul class="space-y-3 px-6 pb-5 text-sm ${muted}">${a.skills.map(id=>{const s=state.skills.find(x=>x.id===id);return s?`<li class="flex items-center gap-3">${icon(s.icon,'h-4 w-4')}${e(s.name)}</li>`:'';}).join('')||'<li>No skills enabled.</li>'}</ul></div></div></div></article>`).join(''):`<p class="${panel} p-12 text-center ${muted}">No agents to display.</p>`}</section>`;
}
function skillsView()         {
  return heading('Skills','The capabilities that make every agent useful.',`${state.skills.length} available skills`)+
  `<div class="mb-6 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-violet-900 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200">${icon('skills','mt-0.5 h-5 w-5 shrink-0')}<p>A <strong>skill</strong> is a capability you attach to an agent, such as researching the web or analyzing documents. One agent can use several skills.</p></div>`+
  table(['Skill','Description','Enabled on','<span class="sr-only">Actions</span>'],state.skills.map(s=>`<tr>${cell(nameCell(s.name,s.id,s.icon))}${cell(e(s.description),'min-w-64 max-w-md '+muted)}${cell(`${state.agents.filter(a=>a.skills.includes(s.id)).length} ${state.agents.filter(a=>a.skills.includes(s.id)).length===1?'agent':'agents'}`,'whitespace-nowrap')}${cell(menu('skill',s.id,s.name,[{label:'View detail',action:'detail'},{label:'Delete',action:'delete'}]))}</tr>`),'Skills');
}
function contractsView()         {
  const total=state.contracts.reduce((s,c)=>s+contractTotal(c),0);
  return heading('Agent Contracts','Every rental, capability and billing detail in one place.',`${state.contracts.length} contracts`)+
  table(['Client / contract','Agent & skills','Rental period','Status','Total paid','<span class="sr-only">Actions</span>'],state.contracts.map(c=>`<tr>${cell(`<p class="whitespace-nowrap font-medium">${e(c.client)}</p><p class="mt-1 text-xs ${muted}">${e(c.id)}</p>`)}${cell(`<p class="whitespace-nowrap font-medium">${e(c.agent)}</p><p class="mt-1 text-xs ${muted}">${c.skills.map(s=>e(s.name)).join(' · ')}</p>`,'min-w-52')}${cell(`<time>${c.start}</time><span class="my-1 block text-xs ${muted}">to ${c.end}</span>`,'whitespace-nowrap')}${cell(badge(c.status))}${cell(money(contractTotal(c)),'whitespace-nowrap font-medium')}${cell(menu('contract',c.id,c.id,[{label:'View detail',action:'detail'}]))}</tr>`),'Contracts',`<tfoot class="border-t border-slate-200 dark:border-slate-700"><tr><th scope="row" colspan="4" class="px-6 py-5 text-sm font-medium ${muted}">Total paid · all contracts</th><td colspan="2" class="px-6 py-5 font-semibold">${money(total)}</td></tr></tfoot>`);
}
function errorsView()         {
  return heading('Error Log','Understand what happened. Keep your agents moving.',`${state.errors.filter(x=>!x.resolved).length} open · ${state.errors.length} total`)+
  table(['Timestamp / agent','Error','Severity','State','<span class="sr-only">Actions</span>'],state.errors.map(x=>`<tr>${cell(`<time class="whitespace-nowrap text-xs ${muted}" datetime="${x.timestamp}">${new Date(x.timestamp).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'})} UTC</time><p class="mt-2 whitespace-nowrap font-medium">${e(x.agent)}</p>`)}${cell(`<p class="font-medium">${e(x.type)}</p><p class="mt-1 text-xs leading-5 ${muted}">${e(x.description)}</p>`,'min-w-64')}${cell(badge(x.severity))}${cell(badge(x.resolved?'resolved':'open'))}${cell(menu('error',x.id,x.id,[{label:'View detail',action:'detail'},{label:x.resolved?'Resolved':'Mark as resolved',action:'resolve',disabled:x.resolved}]))}</tr>`),'Errors');
}
function render()       {
  closeMenu();
  const hash=location.hash.slice(1);
  current=routes.find(r=>r.id===hash) ?? routes[0] ;
  navigation.innerHTML=routes.map(r=>`<a href="#${r.id}" aria-label="${r.label}" title="${r.label}" ${r.id===current.id?'aria-current="page"':''} class="flex items-center justify-center gap-3 rounded-xl px-2 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 lg:justify-start lg:px-3 ${r.id===current.id?'bg-violet-600 text-white shadow-sm':'text-slate-400 hover:bg-slate-800 hover:text-white'}">${icon(r.icon,'h-5 w-5 shrink-0')}<span class="hidden lg:inline">${r.label}</span>${r.id==='errors'?`<span class="ml-auto hidden rounded-md px-1.5 py-0.5 text-xs lg:inline ${r.id===current.id?'bg-violet-500 text-white':'bg-slate-800 text-slate-400'}">${state.errors.filter(x=>!x.resolved).length}</span>`:''}</a>`).join('');
  document.querySelector('#breadcrumb') .textContent=current.label;
  document.title=`${current.label} | AgentHub`;
  const views                           ={dashboard:overview,users:usersView,agents:agentsView,skills:skillsView,contracts:contractsView,errors:errorsView};
  main.innerHTML=`<section aria-labelledby="page-title">${views[current.id] ()}</section>`;
}
function updateTheme()       {
  const dark=document.documentElement.classList.contains('dark');
  themeToggle.innerHTML=icon(dark?'sun':'moon');
  themeToggle.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);
}
themeToggle.addEventListener('click',()=>{
  document.documentElement.classList.toggle('dark');
  try{localStorage.setItem('agenthub-theme',document.documentElement.classList.contains('dark')?'dark':'light');}catch{/* Storage may be blocked; session toggle still works. */}
  updateTheme();
});
function closeMenu(restore=false)       {
  document.querySelector('#action-menu')?.remove();
  if(menuTrigger){menuTrigger.setAttribute('aria-expanded','false');if(restore)menuTrigger.focus();}
  menuTrigger=null;
}
function openMenu(trigger                   )       {
  const wasOpen=menuTrigger===trigger;
  closeMenu();if(wasOpen)return;
  const [type,id]=trigger.dataset.menu .split(':');
  const template=document.querySelector                     (`#menu-${type}-${id}`) ;
  const menuElement=document.createElement('div');
  menuElement.id='action-menu';menuElement.setAttribute('role','group');menuElement.setAttribute('aria-label','Row actions');
  menuElement.className='fixed z-40 w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
  menuElement.innerHTML=template.innerHTML;
  // Native popover anchor positioning is inconsistent across browsers. Use CSS-free
  // Tailwind arbitrary positioning classes generated from integral viewport coordinates.
  const rect=trigger.getBoundingClientRect();
  const x=Math.max(8,Math.min(window.innerWidth-200,rect.right-192));
  const height=template.content.querySelectorAll('button').length*42+14;
  const y=rect.bottom+height>innerHeight?Math.max(8,rect.top-height):rect.bottom+5;
  // Tailwind CDN observes generated utility classes; no inline style attributes.
  menuElement.classList.add(`left-[${Math.round(x)}px]`,`top-[${Math.round(y)}px]`);
  document.body.append(menuElement);trigger.setAttribute('aria-expanded','true');menuTrigger=trigger;
  menuElement.querySelector                   ('button:not(:disabled)')?.focus({preventScroll:true});
}
function openModal(title       ,content       )       {
  dialogOpener=document.activeElement instanceof HTMLElement?document.activeElement:null;
  closeMenu();document.querySelector('#modal-title') .textContent=title;modalContent.innerHTML=content;dialog.showModal();
}
function closeModal()       {dialog.close();}
dialog.addEventListener('close',()=>{
  confirmAction=null;editingAgent=null;
  if(dialogOpener?.isConnected)dialogOpener.focus();else document.querySelector             ('#page-title')?.focus();
});
let backdropPointer=false;
dialog.addEventListener('pointerdown',event=>{backdropPointer=event.target===dialog;});
dialog.addEventListener('click',event=>{if(event.target===dialog&&backdropPointer)closeModal();backdropPointer=false;});
function showDetail(type       ,id       )      {
  if(type==='user'){
    const u=state.users.find(x=>x.id===id);if(!u)return;
    openModal(u.name,detail([['User ID',u.id],['Company',u.company],['Email',u.email],['Plan',u.plan],['Status',u.status],['Joined',u.joined]]));
  }else if(type==='skill'){
    const s=state.skills.find(x=>x.id===id);if(!s)return;
    openModal(s.name,detail([['Skill ID',s.id],['Description',s.description],['Rental price',money(s.price)],['Enabled agents',state.agents.filter(a=>a.skills.includes(s.id)).map(a=>a.name).join(', ')||'None']]));
  }else if(type==='contract'){
    const c=state.contracts.find(x=>x.id===id);if(!c)return;
    openModal(`Contract ${c.id}`,detail([['Client',c.client],['Agent',c.agent],['Rental period',`${c.start} to ${c.end}`],['Status',c.status],['Paid on',c.paid]])+`<h3 class="mb-3 mt-7 text-sm font-semibold">Price breakdown</h3><dl class="space-y-3 text-sm"><div class="flex justify-between gap-4"><dt class="${muted}">Agent base fee</dt><dd>${money(c.base)}</dd></div>${c.skills.map(s=>`<div class="flex justify-between gap-4"><dt class="${muted}">${e(s.name)}</dt><dd>${money(s.price)}</dd></div>`).join('')}<div class="flex justify-between gap-4"><dt class="${muted}">Discount</dt><dd>−${money(c.discount)}</dd></div><div class="flex justify-between gap-4 border-t border-slate-200 pt-4 font-semibold dark:border-slate-700"><dt>Total paid</dt><dd>${money(contractTotal(c))}</dd></div></dl>`);
  }else if(type==='error'){
    const x=state.errors.find(x=>x.id===id);if(!x)return;
    openModal(`Error ${x.id}`,detail([['Agent',x.agent],['Timestamp',x.timestamp],['Type',x.type],['Severity',x.severity],['State',x.resolved?'Resolved':'Open']])+`<h3 class="mb-3 mt-7 text-sm font-semibold">Full execution trace</h3><pre class="overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-slate-100 p-4 text-xs leading-6 dark:bg-slate-950">${e(x.trace)}</pre>`);
  }
}
function configure(id       )      {
  const a=state.agents.find(x=>x.id===id);if(!a)return;
  openModal(`Configure ${a.name}`,`<form id="prompt-form"><label for="system-prompt" class="text-sm font-medium">System prompt</label><p id="prompt-help" class="mb-4 mt-2 text-xs leading-5 ${muted}">Define the agent's role and boundaries. Edits affect this demo session only.</p><textarea id="system-prompt" aria-describedby="prompt-help prompt-error" class="min-h-52 w-full rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 focus:outline focus:outline-2 focus:outline-violet-500 dark:border-slate-700 dark:bg-slate-950">${e(a.prompt)}</textarea><p id="prompt-error" role="alert" class="mt-2 text-sm text-rose-600 dark:text-rose-400"></p><div class="mt-6 flex justify-end gap-3"><button type="button" data-close class="${secondary}">Cancel</button><button type="submit" class="${primary}">Save changes</button></div></form>`);
  editingAgent=id;
}
function requestDelete(type       ,id       )      {
  const item=type==='user'?state.users.find(x=>x.id===id):type==='agent'?state.agents.find(x=>x.id===id):state.skills.find(x=>x.id===id);
  if(!item)return;
  openModal(`Delete ${item.name}?`,`<p class="text-sm leading-6 ${muted}">This removes the ${type} from this demo session. Historical contract and error records stay intact. Reset demo data can restore it.</p><div class="mt-7 flex justify-end gap-3"><button data-close class="${secondary}">Cancel</button><button id="confirm-delete" class="${primary} bg-rose-600 hover:bg-rose-700">Delete ${type}</button></div>`);
  confirmAction=()=>{
    if(type==='user')state.users=state.users.filter(x=>x.id!==id);
    if(type==='agent')state.agents=state.agents.filter(x=>x.id!==id);
    if(type==='skill'){state.skills=state.skills.filter(x=>x.id!==id);state.agents.forEach(a=>{a.skills=a.skills.filter(s=>s!==id);});}
    closeModal();render();notify(`${item.name} deleted from demo.`);
  };
}
document.addEventListener('submit',event=>{
  if(!(event.target instanceof HTMLFormElement)||event.target.id!=='prompt-form')return;
  event.preventDefault();const textarea=document.querySelector                     ('#system-prompt') ;const value=textarea.value.trim();
  if(!value){document.querySelector('#prompt-error') .textContent='Enter a system prompt before saving.';textarea.setAttribute('aria-invalid','true');textarea.focus();return;}
  const a=state.agents.find(x=>x.id===editingAgent);if(a){a.prompt=value;closeModal();notify('System prompt saved for this session.');}
});
document.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  const target=event.target.closest             ('button');
  if(target?.matches('[data-menu]')){openMenu(target                     );return;}
  if(!event.target.closest('#action-menu'))closeMenu();
  if(target?.matches('[data-close]')){closeModal();return;}
  if(target?.id==='confirm-delete'){confirmAction?.();return;}
  if(target?.dataset.expand){
    const expanded=target.getAttribute('aria-expanded')==='true';const content=document.getElementById(`skills-${target.dataset.expand}`) ;
    target.setAttribute('aria-expanded',String(!expanded));content.inert=expanded;content.setAttribute('aria-hidden',String(expanded));
    content.classList.toggle('grid-rows-[0fr]',expanded);content.classList.toggle('grid-rows-[1fr]',!expanded);content.classList.toggle('opacity-0',expanded);content.classList.toggle('opacity-100',!expanded);
    target.querySelector('[data-chevron]')?.classList.toggle('rotate-90',!expanded);return;
  }
  if(target?.dataset.action){
    const {action,type,id}=target.dataset;if(!type||!id)return;
    // Preserve the row trigger for dialog focus restoration, rather than its transient menu button.
    menuTrigger?.focus();
    if(action==='detail')showDetail(type,id);
    if(action==='configure')configure(id);
    if(action==='delete')requestDelete(type,id);
    if(action==='resolve'){const x=state.errors.find(x=>x.id===id);if(x&&!x.resolved){x.resolved=true;render();notify('Error marked as resolved.');document.querySelector             (`[data-menu="error:${id}"]`)?.focus();}}
  }
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuTrigger){event.preventDefault();closeMenu(true);}});
document.addEventListener('scroll',()=>closeMenu(),true);
window.addEventListener('resize',()=>closeMenu());
window.addEventListener('hashchange',()=>{if(dialog.open)closeModal();render();document.querySelector             ('#page-title')?.focus();});
document.querySelector('#reset') .addEventListener('click',()=>{if(dialog.open)closeModal();state=createState();render();notify('Demo records restored.');});
updateTheme();render();
