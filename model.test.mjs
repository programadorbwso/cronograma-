import test from 'node:test';
import assert from 'node:assert/strict';
import { weeklyMinutes, validMinutes, validState, weekStart } from './model.mjs';
test('semana começa na segunda, inclusive quando hoje é domingo', () => {
 assert.equal(weekStart(new Date(2026, 9, 25, 12)).getDate(), 19);
});
test('progresso soma somente sessões da matéria na semana atual, sem sessões futuras', () => {
 const now = new Date(2026, 9, 21, 12); const subject = {id:'a'};
 const sessions = [
 {subjectId:'a',minutes:30,at:new Date(2026,9,19,10).toISOString()},
 {subjectId:'a',minutes:20,at:new Date(2026,9,21,10).toISOString()},
 {subjectId:'a',minutes:90,at:new Date(2026,9,18,10).toISOString()},
 {subjectId:'a',minutes:60,at:new Date(2026,9,22,10).toISOString()},
 {subjectId:'b',minutes:10,at:new Date(2026,9,20,10).toISOString()}];
 assert.equal(weeklyMinutes(subject,sessions,now),50);
});
test('valida duração e dados persistidos', () => {
 for (const v of [0,-1,1.5,1441,NaN]) assert.equal(validMinutes(v),false);
 assert.equal(validMinutes(30),true);
 assert.equal(validState({subjects:[{id:'a',name:'Física',goal:120}],sessions:[]}),true);
 assert.equal(validState({subjects:[],sessions:[{subjectId:'a',minutes:-1,at:'invalid'}]}),false);
});
