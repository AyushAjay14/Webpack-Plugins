import { d1Func } from './d1'
const x = { objectFunc : d1Func() }
x.objectFunc
console.log('D');

export const dFunc = () => { console.log('dFunc invoked'); }