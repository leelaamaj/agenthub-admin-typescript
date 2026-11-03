export const escapeHtml = (value                 )         => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] ));
const paths                        = {
  dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
  agents:'<rect x="4" y="7" width="16" height="14" rx="4"/><path d="M12 3v4M8 12h.01M16 12h.01M9 16h6M1 12h3m16 0h3"/>',
  skills:'<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',
  contracts:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5"/>',
  errors:'<path d="m10.3 3.9-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0zM12 9v4m0 4h.01"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18z"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 5h.01m4 0h.01m4 0h.01"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  money:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
  tag:'<path d="M20 13 13 20a2 2 0 0 1-3 0L2 12V2h10l8 8a2 2 0 0 1 0 3z"/><circle cx="7" cy="7" r="1"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon:'<path d="M21 12.8A9 9 0 0 1 11.2 3 9 9 0 1 0 21 12.8z"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  chart:'<path d="M3 3v18h18M7 14l4-4 4 3 5-7"/>',
};
export const icon = (name        , classes='h-5 w-5')         => `<svg aria-hidden="true" focusable="false" class="${classes}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] ?? paths.agents}</svg>`;
export const panel = 'rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900';
export const muted = 'text-slate-500 dark:text-slate-400';
export const button = 'rounded-lg px-4 py-2.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500';
export const primary = `${button} bg-violet-600 text-white hover:bg-violet-700`;
export const secondary = `${button} border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800`;
export function badge(status        )         {
  const colors                        = {active:'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',completed:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',resolved:'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',inactive:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',failing:'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',critical:'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',warning:'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',info:'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',suspended:'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',open:'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'};
  return `<span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium capitalize ${colors[status] ?? colors.inactive}"><span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>${escapeHtml(status)}</span>`;
}
                                                                               
export function menu(type        , id        , name        , actions              )         {
  return `<button data-menu="${type}:${id}" aria-expanded="false" aria-controls="action-menu" aria-label="Actions for ${escapeHtml(name)}" class="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 dark:text-slate-400 dark:hover:bg-slate-800">⋮</button><template id="menu-${type}-${id}">${actions.map(a=>`<button data-action="${a.action}" data-type="${type}" data-id="${id}" ${a.disabled?'disabled':''} class="block w-full rounded-md px-3 py-2.5 text-left text-sm hover:bg-slate-100 focus:bg-slate-100 focus:outline-none disabled:cursor-default disabled:opacity-40 dark:hover:bg-slate-800 dark:focus:bg-slate-800 ${a.action==='delete'?'text-rose-600 dark:text-rose-400':''}">${escapeHtml(a.label)}</button>`).join('')}</template>`;
}
export function heading(title        , description        , count         )         {return `<div class="mb-8 flex flex-wrap items-end justify-between gap-4"><div><h1 id="page-title" tabindex="-1" class="text-3xl font-semibold tracking-tight focus:outline-none">${title}</h1><p class="mt-2 text-sm ${muted}">${description}</p></div>${count?`<span class="text-sm ${muted}">${count}</span>`:''}</div>`;}
export function table(headers          , rows          , caption        , footer='')         {
  return `<div class="${panel} overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left text-sm"><caption class="sr-only">${caption}</caption><thead class="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"><tr>${headers.map(x=>`<th scope="col" class="whitespace-nowrap px-6 py-4 font-medium">${x}</th>`).join('')}</tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800">${rows.length?rows.join(''):`<tr><td colspan="${headers.length}" class="p-12 text-center ${muted}">No ${caption.toLowerCase()} to display.</td></tr>`}</tbody>${footer}</table></div><div class="border-t border-slate-100 px-6 py-4 text-xs ${muted} dark:border-slate-800">${rows.length} ${rows.length===1?'record':'records'} · Sample workspace data</div></div>`;
}
export const cell = (content       , extra='')       =>`<td class="px-6 py-5 align-middle ${extra}">${content}</td>`;
export const detail = (entries                   )         => `<dl class="space-y-4">${entries.map(([k,v])=>`<div class="grid grid-cols-3 gap-4 border-b border-slate-100 pb-3 dark:border-slate-800"><dt class="text-sm ${muted}">${escapeHtml(k)}</dt><dd class="col-span-2 break-words text-sm font-medium">${escapeHtml(v)}</dd></div>`).join('')}</dl>`;
