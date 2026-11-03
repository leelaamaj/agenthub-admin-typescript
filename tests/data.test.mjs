import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,contractTotal,BILLING_MONTH} from '../dist/data.js';
test('seed records satisfy the assignment minimums and share valid references',()=>{
 const s=createState();
 assert.deepEqual([s.users.length,s.agents.length,s.skills.length,s.contracts.length,s.errors.length],[5,4,4,4,6]);
 for(const a of s.agents){assert(s.users.some(u=>u.id===a.owner));for(const id of a.skills)assert(s.skills.some(x=>x.id===id));}
 for(const c of s.contracts){assert(s.agents.some(a=>a.name===c.agent));assert(s.users.some(u=>u.company===c.client));}
 for(const x of s.errors)assert(s.agents.some(a=>a.name===x.agent));
});
test('itemized contract amounts and current-month revenue are exact integer cents',()=>{
 const s=createState();assert.deepEqual(s.contracts.map(contractTotal),[150000,135000,140000,105000]);
 const month=s.contracts.filter(x=>x.paid.startsWith(BILLING_MONTH));
 assert.equal(month.reduce((n,c)=>n+contractTotal(c),0),425000);
 assert.equal(month.reduce((n,c)=>n+c.discount,0),15000);
});
test('new demo state is independent and historical snapshots survive skill mutation',()=>{
 const a=createState(),b=createState();a.skills[0].name='Changed';a.agents[0].skills.length=0;
 assert.equal(b.skills[0].name,'Web research');assert.equal(a.contracts[0].skills[0].name,'Web research');assert.equal(contractTotal(a.contracts[0]),150000);
});
