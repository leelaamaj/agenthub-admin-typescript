export type AgentStatus = 'active' | 'inactive' | 'failing';
export interface User { id: string; name: string; company: string; email: string; plan: string; status: 'active' | 'suspended'; joined: string }
export interface Skill { id: string; name: string; description: string; price: number; icon: string }
export interface Agent { id: string; name: string; owner: string; ownerName: string; description: string; status: AgentStatus; skills: string[]; prompt: string; icon: string }
export interface ContractSkill { id: string; name: string; price: number }
export interface RentalContract { id: string; client: string; agent: string; skills: ContractSkill[]; start: string; end: string; paid: string; status: 'active' | 'completed'; base: number; discount: number }
export interface AgentError { id: string; agent: string; timestamp: string; type: string; severity: 'critical' | 'warning' | 'info'; description: string; trace: string; resolved: boolean }
export interface DemoState { users: User[]; agents: Agent[]; skills: Skill[]; contracts: RentalContract[]; errors: AgentError[] }
export const BILLING_MONTH = '2026-11';
export const money = (cents: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(cents / 100);
export const contractTotal = (c: RentalContract): number => c.base + c.skills.reduce((s, x) => s + x.price, 0) - c.discount;
export function createState(): DemoState {
  const users: User[] = [
    {id:'usr-01',name:'Maya Chen',company:'Northstar Studio',email:'maya@example.com',plan:'Business',status:'active',joined:'2026-06-12'},
    {id:'usr-02',name:'Jordan Ellis',company:'Forma Labs',email:'jordan@example.com',plan:'Pro',status:'active',joined:'2026-07-03'},
    {id:'usr-03',name:'Sofia Rivera',company:'Bloom Collective',email:'sofia@example.com',plan:'Business',status:'active',joined:'2026-08-19'},
    {id:'usr-04',name:'Noah Brooks',company:'Aperture Works',email:'noah@example.com',plan:'Starter',status:'suspended',joined:'2026-09-08'},
    {id:'usr-05',name:'Amara Okafor',company:'Kindred Digital',email:'amara@example.com',plan:'Pro',status:'active',joined:'2026-10-14'}
  ];
  const skills: Skill[] = [
    {id:'web',name:'Web research',description:'Find and summarize public sources with clear citations.',price:15000,icon:'globe'},
    {id:'docs',name:'Document analysis',description:'Extract useful information from uploaded documents.',price:20000,icon:'file'},
    {id:'calendar',name:'Calendar management',description:'Read availability and prepare scheduling suggestions.',price:10000,icon:'calendar'},
    {id:'email',name:'Email drafting',description:'Prepare contextual messages for human review.',price:15000,icon:'mail'}
  ];
  const agents: Agent[] = [
    {id:'atlas',name:'Atlas Research',owner:'usr-01',ownerName:'Maya Chen',description:'Your research desk, always one step ahead.',status:'active',skills:['web','docs'],prompt:'You are Atlas, a careful research assistant. Cite sources, distinguish facts from inference, and ask before taking external actions.',icon:'globe'},
    {id:'nova',name:'Nova Docs',owner:'usr-02',ownerName:'Jordan Ellis',description:'Turn long documents into clear decisions.',status:'active',skills:['docs','email'],prompt:'You are Nova, a document analyst. Summarize faithfully, preserve uncertainty, and draft recommendations for human review.',icon:'file'},
    {id:'orbit',name:'Orbit Scheduler',owner:'usr-03',ownerName:'Sofia Rivera',description:'Keep busy calendars moving together.',status:'inactive',skills:['calendar','email'],prompt:'You are Orbit, a scheduling assistant. Check availability, propose suitable times, and ask before sending invitations.',icon:'calendar'},
    {id:'echo',name:'Echo Outreach',owner:'usr-05',ownerName:'Amara Okafor',description:'Make every conversation feel considered.',status:'failing',skills:['web','email'],prompt:'You are Echo, an outreach assistant. Research public company context and prepare personalized email drafts. Never send without approval.',icon:'mail'}
  ];
  const snapshot = (ids: string[]): ContractSkill[] => ids.map(id => { const s=skills.find(x=>x.id===id)!; return {id:s.id,name:s.name,price:s.price}; });
  const contracts: RentalContract[] = [
    {id:'CTR-1042',client:'Northstar Studio',agent:'Atlas Research',skills:snapshot(['web','docs']),start:'2026-11-01',end:'2026-11-30',paid:'2026-11-01',status:'active',base:120000,discount:5000},
    {id:'CTR-1043',client:'Forma Labs',agent:'Nova Docs',skills:snapshot(['docs','email']),start:'2026-11-01',end:'2026-11-30',paid:'2026-11-01',status:'active',base:100000,discount:0},
    {id:'CTR-1044',client:'Kindred Digital',agent:'Echo Outreach',skills:snapshot(['web','email']),start:'2026-11-01',end:'2026-11-30',paid:'2026-11-02',status:'active',base:120000,discount:10000},
    {id:'CTR-1018',client:'Bloom Collective',agent:'Orbit Scheduler',skills:snapshot(['calendar','email']),start:'2026-10-01',end:'2026-10-31',paid:'2026-10-01',status:'completed',base:80000,discount:0}
  ];
  const errors: AgentError[] = [
    {id:'ERR-081',agent:'Echo Outreach',timestamp:'2026-11-03T09:42:00Z',type:'Authentication',severity:'critical',description:'Email provider rejected the connection.',trace:'AuthenticationError: provider token expired\n  at email.connect (connector.ts:48)\n  at outreach.run (runner.ts:112)\nAction: reconnect the provider before retrying.',resolved:false},
    {id:'ERR-080',agent:'Atlas Research',timestamp:'2026-11-03T09:18:00Z',type:'Rate limit',severity:'warning',description:'Research provider request quota reached.',trace:'RateLimitError: HTTP 429\n  at research.fetch (connector.ts:62)\nRetry-After: 60 seconds',resolved:false},
    {id:'ERR-079',agent:'Nova Docs',timestamp:'2026-11-03T08:55:00Z',type:'Validation',severity:'warning',description:'Uploaded document could not be parsed.',trace:'ParseError: unsupported encrypted PDF\n  at documents.parse (parser.ts:27)\nAction: request an unencrypted copy.',resolved:false},
    {id:'ERR-078',agent:'Echo Outreach',timestamp:'2026-11-02T16:20:00Z',type:'Timeout',severity:'critical',description:'Outreach task exceeded its time limit.',trace:'TimeoutError: execution exceeded 30000ms\n  at runner.execute (runner.ts:89)',resolved:false},
    {id:'ERR-077',agent:'Orbit Scheduler',timestamp:'2026-11-02T12:06:00Z',type:'Connection',severity:'info',description:'Calendar connection recovered after retry.',trace:'ConnectionError: temporary upstream disconnect\n  at calendar.read (calendar.ts:19)\nRecovered after retry 2.',resolved:true},
    {id:'ERR-076',agent:'Atlas Research',timestamp:'2026-11-01T11:32:00Z',type:'Rate limit',severity:'info',description:'Queued research resumed successfully.',trace:'RateLimitError: quota temporarily reached\n  at queue.process (queue.ts:54)\nResolved after scheduled backoff.',resolved:true}
  ];
  return {users,skills,agents,contracts,errors};
}
