import { d1Func } from './d1'

const callingdFunc = ()=>{
    d1Func();
}
callingdFunc();
console.log('D');

export const dFunc = () => { console.log('dFunc invoked'); }